import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor {
    type UserRole = {
        #Admin;
        #Customer;
        #Agent;
    };

    type User = {
        var fullName : Text;
        email : Text;
        var password : Text;
        var role : UserRole;
        accountNumber : Text;
        var zambianKwachaBalance : Float;
        var malawianKwachaBalance : Float;
        var zimbabweanDollarBalance : Float;
        var usDollarBalance : Float;
    };

    type Balances = {
        zambianKwacha : Float;
        malawianKwacha : Float;
        zimbabweanDollar : Float;
        usDollar : Float;
    };

    type BillType = {
        #Water;
        #Electricity;
        #School;
    };

    type Currency = {
        #ZambianKwacha;
        #MalawianKwacha;
        #ZimbabweanDollar;
        #USDollar;
    };

    type TransferResult = {
        #Success : Text;
        #InsufficientBalance;
        #AccountNotFound;
        #UnsupportedCurrency;
    };

    private stable var usersEntries : [(Text, User)] = [];
    private stable var accountNumberToUserEntries : [(Text, Text)] = [];
    private stable var emailToUserEntries : [(Text, Text)] = [];
    private stable var stableAccountNumberCounter : Nat = 1000;
    private stable var stableZambianKwachaBalance : Float = 1000;
    private stable var stableMalawianKwachaBalance : Float = 0;
    private stable var stableZimbabweanDollarBalance : Float = 0;
    private stable var stableUsDollarBalance : Float = 0;

    private var users = TrieMap.TrieMap<Text, User>(Text.equal, Text.hash);
    private var accountNumberToUser = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);
    private var emailToUser = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

    private var accountNumberCounter : Nat = stableAccountNumberCounter;

    private var zambianKwachaBalance : Float = stableZambianKwachaBalance;
    private var malawianKwachaBalance : Float = stableMalawianKwachaBalance;
    private var zimbabweanDollarBalance : Float = stableZimbabweanDollarBalance;
    private var usDollarBalance : Float = stableUsDollarBalance;

    // Exchange rates (as of July 2024, approximate)
    let exchangeRates = {
        zambianToMalawian = 46.37;
        zambianToZimbabwean = 914.85;
        zambianToUSD = 0.044;
        malawianToZambian = 0.022;
        malawianToZimbabwean = 19.73;
        malawianToUSD = 0.00095;
        zimbabweanToZambian = 0.0011;
        zimbabweanToMalawian = 0.051;
        zimbabweanToUSD = 0.000048;
        usdToZambian = 22.73;
        usdToMalawian = 1053.74;
        usdToZimbabwean = 20833.33;
    };

    public shared func registerUser(fullName : Text, email : Text, password : Text, role : UserRole) : async Result.Result<Text, Text> {
        if (Text.size(fullName) == 0 or Text.size(email) == 0 or Text.size(password) < 8) {
            return #err("Invalid input. Ensure all fields are filled and password is at least 8 characters long.");
        };

        // Check if email is already registered
        switch (emailToUser.get(email)) {
            case (?_) { return #err("Email already registered") };
            case null {
                let accountNumber = "AC" # Nat.toText(accountNumberCounter);
                accountNumberCounter += 1;

                let newUser : User = {
                    var fullName = fullName;
                    email = email;
                    var password = password;
                    var role = role;
                    accountNumber = accountNumber;
                    var zambianKwachaBalance = 0;
                    var malawianKwachaBalance = 0;
                    var zimbabweanDollarBalance = 0;
                    var usDollarBalance = 0;
                };

                users.put(accountNumber, newUser);
                accountNumberToUser.put(accountNumber, accountNumber);
                emailToUser.put(email, accountNumber);
                #ok("User registered successfully as " # debug_show (role) # ". Account number: " # accountNumber);
            };
        };
    };

    public func login(email : Text, password : Text) : async Result.Result<(Text, Text, UserRole), Text> {
        switch (emailToUser.get(email)) {
            case null { return #err("User not found") };
            case (?userId) {
                switch (users.get(userId)) {
                    case null { return #err("User not found") };
                    case (?user) {
                        if (user.password == password) {
                            return #ok((userId, user.fullName, user.role));
                        } else {
                            return #err("Incorrect password");
                        };
                    };
                };
            };
        };
    };

    public query func getBalance(userId : Text) : async Result.Result<Balances, Text> {
        switch (users.get(userId)) {
            case null { #err("User not found") };
            case (?user) {
                #ok({
                    zambianKwacha = user.zambianKwachaBalance;
                    malawianKwacha = user.malawianKwachaBalance;
                    zimbabweanDollar = user.zimbabweanDollarBalance;
                    usDollar = user.usDollarBalance;
                });
            };
        };
    };

    public shared func exchangeCurrency(userId : Text, fromCurrency : Currency, toCurrency : Currency, amount : Float) : async Result.Result<Float, Text> {
        switch (users.get(userId)) {
            case null { #err("User not found") };
            case (?user) {
                var exchangedAmount : Float = 0.0;

                func updateBalance(currency : Currency, delta : Float) {
                    switch (currency) {
                        case (#ZambianKwacha) {
                            user.zambianKwachaBalance += delta;
                            zambianKwachaBalance += delta;
                        };
                        case (#MalawianKwacha) {
                            user.malawianKwachaBalance += delta;
                            malawianKwachaBalance += delta;
                        };
                        case (#ZimbabweanDollar) {
                            user.zimbabweanDollarBalance += delta;
                            zimbabweanDollarBalance += delta;
                        };
                        case (#USDollar) {
                            user.usDollarBalance += delta;
                            usDollarBalance += delta;
                        };
                    };
                };

                switch (fromCurrency, toCurrency) {
                    case (#ZambianKwacha, #MalawianKwacha) {
                        exchangedAmount := amount * exchangeRates.zambianToMalawian;
                    };
                    case (#ZambianKwacha, #ZimbabweanDollar) {
                        exchangedAmount := amount * exchangeRates.zambianToZimbabwean;
                    };
                    case (#ZambianKwacha, #USDollar) {
                        exchangedAmount := amount * exchangeRates.zambianToUSD;
                    };
                    case (#MalawianKwacha, #ZambianKwacha) {
                        exchangedAmount := amount * exchangeRates.malawianToZambian;
                    };
                    case (#MalawianKwacha, #ZimbabweanDollar) {
                        exchangedAmount := amount * exchangeRates.malawianToZimbabwean;
                    };
                    case (#MalawianKwacha, #USDollar) {
                        exchangedAmount := amount * exchangeRates.malawianToUSD;
                    };
                    case (#ZimbabweanDollar, #ZambianKwacha) {
                        exchangedAmount := amount * exchangeRates.zimbabweanToZambian;
                    };
                    case (#ZimbabweanDollar, #MalawianKwacha) {
                        exchangedAmount := amount * exchangeRates.zimbabweanToMalawian;
                    };
                    case (#ZimbabweanDollar, #USDollar) {
                        exchangedAmount := amount * exchangeRates.zimbabweanToUSD;
                    };
                    case (#USDollar, #ZambianKwacha) {
                        exchangedAmount := amount * exchangeRates.usdToZambian;
                    };
                    case (#USDollar, #MalawianKwacha) {
                        exchangedAmount := amount * exchangeRates.usdToMalawian;
                    };
                    case (#USDollar, #ZimbabweanDollar) {
                        exchangedAmount := amount * exchangeRates.usdToZimbabwean;
                    };
                    case (_) { return #err("Unsupported currency exchange") };
                };

                updateBalance(fromCurrency, -amount);
                updateBalance(toCurrency, exchangedAmount);

                #ok(exchangedAmount);
            };
        };
    };

    public shared func payBill(userId : Text, billType : BillType, currency : Currency, amount : Float) : async Result.Result<Text, Text> {
        switch (users.get(userId)) {
            case null { #err("User not found") };
            case (?user) {
                var userBalance : Float = 0.0;

                func updateBalance(user : User, currency : Currency, delta : Float) {
                    switch (currency) {
                        case (#ZambianKwacha) {
                            user.zambianKwachaBalance += delta;
                        };
                        case (#MalawianKwacha) {
                            user.malawianKwachaBalance += delta;
                        };
                        case (#ZimbabweanDollar) {
                            user.zimbabweanDollarBalance += delta;
                        };
                        case (#USDollar) {
                            user.usDollarBalance += delta;
                        };
                    };
                };

                switch (currency) {
                    case (#ZambianKwacha) {
                        userBalance := user.zambianKwachaBalance;
                    };
                    case (#MalawianKwacha) {
                        userBalance := user.malawianKwachaBalance;
                    };
                    case (#ZimbabweanDollar) {
                        userBalance := user.zimbabweanDollarBalance;
                    };
                    case (#USDollar) {
                        userBalance := user.usDollarBalance;
                    };
                };

                if (userBalance >= amount) {
                    updateBalance(user, currency, -amount);
                    #ok("Bill payment successful for " # debug_show (billType) # ". Amount: " # Float.toText(amount) # " in " # debug_show (currency) # ".");
                } else {
                    #err("Insufficient balance.");
                };
            };
        };
    };
    public shared func transferFunds(senderId : Text, recipientAccountNumber : Text, currency : Currency, amount : Float) : async TransferResult {
        if (amount <= 0.0) {
            return #InsufficientBalance;
        };

        switch (users.get(senderId)) {
            case null { return #AccountNotFound };
            case (?sender) {
                switch (accountNumberToUser.get(recipientAccountNumber)) {
                    case null { return #AccountNotFound };
                    case (?recipientId) {
                        switch (users.get(recipientId)) {
                            case null { return #AccountNotFound };
                            case (?recipient) {
                                var senderBalance : Float = switch (currency) {
                                    case (#ZambianKwacha) sender.zambianKwachaBalance;
                                    case (#MalawianKwacha) sender.malawianKwachaBalance;
                                    case (#ZimbabweanDollar) sender.zimbabweanDollarBalance;
                                    case (#USDollar) sender.usDollarBalance;
                                };

                                if (senderBalance < amount) {
                                    return #InsufficientBalance;
                                };

                                func updateBalance(user : User, currency : Currency, delta : Float) {
                                    switch (currency) {
                                        case (#ZambianKwacha) {
                                            user.zambianKwachaBalance += delta;
                                        };
                                        case (#MalawianKwacha) {
                                            user.malawianKwachaBalance += delta;
                                        };
                                        case (#ZimbabweanDollar) {
                                            user.zimbabweanDollarBalance += delta;
                                        };
                                        case (#USDollar) {
                                            user.usDollarBalance += delta;
                                        };
                                    };
                                };

                                updateBalance(sender, currency, -amount);
                                updateBalance(recipient, currency, amount);

                                return #Success("Funds transferred successfully");
                            };
                        };
                    };
                };
            };
        };
    };

    public shared func depositIntoUserByAccount(accountNumber : Text, currency : Currency, amount : Float) : async Result.Result<Text, Text> {
        switch (accountNumberToUser.get(accountNumber)) {
            case null { #err("Target account not found") };
            case (?targetId) {
                switch (users.get(targetId)) {
                    case null { #err("Target user not found") };
                    case (?targetUser) {
                        switch (currency) {
                            case (#ZambianKwacha) {
                                targetUser.zambianKwachaBalance += amount;
                                zambianKwachaBalance += amount;
                            };
                            case (#MalawianKwacha) {
                                targetUser.malawianKwachaBalance += amount;
                                malawianKwachaBalance += amount;
                            };
                            case (#ZimbabweanDollar) {
                                targetUser.zimbabweanDollarBalance += amount;
                                zimbabweanDollarBalance += amount;
                            };
                            case (#USDollar) {
                                targetUser.usDollarBalance += amount;
                                usDollarBalance += amount;
                            };
                        };
                        #ok("Deposit successful");
                    };
                };
            };
        };
    };

    public shared func withdrawFunds(userId : Text, currency : Currency, amount : Float) : async Result.Result<Text, Text> {
        if (amount <= 0.0) {
            return #err("Invalid amount. Must be greater than 0.");
        };

        switch (users.get(userId)) {
            case null { return #err("User not found") };
            case (?user) {
                var userBalance : Float = switch (currency) {
                    case (#ZambianKwacha) user.zambianKwachaBalance;
                    case (#MalawianKwacha) user.malawianKwachaBalance;
                    case (#ZimbabweanDollar) user.zimbabweanDollarBalance;
                    case (#USDollar) user.usDollarBalance;
                };

                if (userBalance < amount) {
                    return #err("Insufficient balance");
                };

                func updateBalance(currency : Currency, delta : Float) {
                    switch (currency) {
                        case (#ZambianKwacha) {
                            user.zambianKwachaBalance += delta;
                            zambianKwachaBalance += delta;
                        };
                        case (#MalawianKwacha) {
                            user.malawianKwachaBalance += delta;
                            malawianKwachaBalance += delta;
                        };
                        case (#ZimbabweanDollar) {
                            user.zimbabweanDollarBalance += delta;
                            zimbabweanDollarBalance += delta;
                        };
                        case (#USDollar) {
                            user.usDollarBalance += delta;
                            usDollarBalance += delta;
                        };
                    };
                };

                updateBalance(currency, -amount);
                #ok("Withdrawal successful");
            };
        };
    };

    // Save state to stable variables on upgrade
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        accountNumberToUserEntries := Iter.toArray(accountNumberToUser.entries());
        emailToUserEntries := Iter.toArray(emailToUser.entries());

        stableAccountNumberCounter := accountNumberCounter;
        stableZambianKwachaBalance := zambianKwachaBalance;
        stableMalawianKwachaBalance := malawianKwachaBalance;
        stableZimbabweanDollarBalance := zimbabweanDollarBalance;
        stableUsDollarBalance := usDollarBalance;
    };

    // Restore state from stable variables after upgrade
    system func postupgrade() {
        users := TrieMap.fromEntries(usersEntries.vals(), Text.equal, Text.hash);
        accountNumberToUser := TrieMap.fromEntries(accountNumberToUserEntries.vals(), Text.equal, Text.hash);
        emailToUser := TrieMap.fromEntries(emailToUserEntries.vals(), Text.equal, Text.hash);

        accountNumberCounter := stableAccountNumberCounter;
        zambianKwachaBalance := stableZambianKwachaBalance;
        malawianKwachaBalance := stableMalawianKwachaBalance;
        zimbabweanDollarBalance := stableZimbabweanDollarBalance;
        usDollarBalance := stableUsDollarBalance;
    };
};
