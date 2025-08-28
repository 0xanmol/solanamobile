# Coin Toss Flutter App

This is a simple coin toss game built with Flutter that demonstrates a clean architecture approach and integration with the Solana blockchain. This app is designed to serve as a learning resource for developers looking to build Flutter applications that interact with Solana.

The application is built to be cross-platform, with support for **Android, iOS, Linux, macOS, Web, and Windows**.

## Core Technologies

- **Flutter**: For building the cross-platform user interface.
- **Riverpod**: For state management.
- **Solana**: For blockchain interaction.
- **solana_mobile_client**: For connecting with mobile wallets using the Mobile Wallet Adapter (MWA) standard.
- **SharedPreferences**: For local data persistence.

## App Flow

1.  **Authentication**: The app uses `solana_mobile_client` to connect to a mobile wallet for authentication.
2.  **Profile Creation**: On the first launch, the user is prompted to create a profile by entering their name. This action creates a new account on the Solana blockchain tied to their wallet address.
3.  **Coin Toss Game**: The main screen of the app where the user can play the coin toss game. The result of the toss is recorded on-chain.

## Folder Structure

The project follows a feature-based folder structure to keep the code organized and modular.

```
lib/
├── app.dart             # MaterialApp, routing, and initial setup.
├── main.dart            # Entry point of the application.
│
├── config/
│   └── programs.dart      # Stores constant values, like the Solana Program ID.
│
├── core/
│   ├── storage/
│   │   └── local_storage.dart # Local storage helper for SharedPreferences.
│   └── theme/
│       └── app_theme.dart   # App theming (colors, text styles).
│
└── features/
    ├── auth/
    │   └── presentation/
    │       ├── login_notifier.dart # Handles the logic for wallet authentication.
    │       └── login_screen.dart   # The UI for the login screen.
    │
    ├── coin_toss/
    │   ├── data/
    │   │   └── execute_toss_dto.dart # Data Transfer Object for the execute_toss instruction.
    │   ├── domain/
    │   │   ├── coin_toss_service.dart # Contains the logic for the coin toss.
    │   │   └── player_profile.dart    # Data model for the on-chain player profile.
    │   └── presentation/
    │       ├── coin_toss_notifier.dart # State management for the coin toss screen.
    │       ├── coin_toss_page.dart     # The UI for the coin toss game.
    │       └── widgets/
    │           └── flipping_coin_animation.dart # Animation widget for the coin toss.
    │
    └── profile/
        ├── data/
        │   ├── create_player_profile_dto.dart # DTO for create_player_profile instruction.
        │   └── profile_storage_service.dart   # Service for storing profile data locally.
        ├── domain/
        │   └── player.dart          # Data model for the local player.
        └── presentation/
            ├── profile_notifier.dart # Handles the logic for profile creation.
            └── profile_page.dart     # The UI for creating a user profile.
```

## Solana Integration Details

### Connecting to Mobile Wallet Adapter (MWA)

To connect to a mobile wallet, we use the `solana_mobile_client` package. The connection flow is managed in the notifiers (`LoginNotifier`, `ProfileNotifier`, etc.).

1.  **Create a Session**: A `LocalAssociationScenario` is created to manage the connection with the wallet.
    ```dart
    session = await LocalAssociationScenario.create();
    ```

2.  **Start the Session**: We start an activity to bring the wallet to the foreground for user interaction.
    ```dart
    session.startActivityForResult(null).ignore();
    final client = await session.start();
    ```

3.  **Authorize the dApp**: The `authorize` method requests authorization from the wallet. This will typically show a prompt to the user in their wallet app.
    - `identityUri`: A URI that identifies your app. <!--found in build.gradle.kts - -->
    - `identityName`: The name of your app that is displayed to the user.
    - `cluster`: The Solana cluster you want to connect to (`devnet`, `testnet`, `mainnet-beta`).
    ```dart
    final result = await client.authorize(
      identityUri: Uri.parse('cointoss://app'),
      identityName: 'Coin Toss',
      cluster: 'devnet',
    );
    ```
    The result contains the `authToken`, `publicKey`, and other details.

4.  **Reauthorize (if needed)**: If you already have an `authToken`, you can use `reauthorize` to quickly re-establish the connection without requiring the user to approve it again.
    ```dart
    await mobileClient.reauthorize(
      identityUri: Uri.parse('cointoss://app'),
      identityName: 'Coin Toss',
      authToken: authToken,
    );
    ```

5.  **Close the Session**: It's crucial to close the session in a `finally` block to release resources.
    ```dart
    finally {
      if (session != null) {
        await session.close();
      }
    }
    ```

#### Android Configuration

For the Mobile Wallet Adapter to redirect back to your app after authorization, you need to add an `intent-filter` to your `android/app/src/main/AndroidManifest.xml` file. This filter tells the Android OS that your app can handle deep links with a specific scheme and host.

```xml
<!-- Deep link for wallet adapter -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="cointoss" android:host="app" />
</intent-filter>
```

This should be placed inside the `<activity>` tag of your main activity. The `android:scheme` and `android:host` should match the `identityUri` you use when calling `client.authorize()`. In this app, the URI is `cointoss://app`.

### Reading Data from the Blockchain

To read data from an on-chain account, we use the `solana` package.

1.  **Create a SolanaClient**: This client connects to the Solana RPC endpoint.
    ```dart
    final client = SolanaClient(
      rpcUrl: Uri.parse('https://api.devnet.solana.com'),
      websocketUrl: Uri.parse('wss://api.devnet.solana.com'),
    );
    ```

2.  **Get Account Info**: Use `getAccountInfo` with the base58 address of the account.
    ```dart
    final info = await client.rpcClient.getAccountInfo(
        playerProfilePda.toBase58(),
        encoding: Encoding.base64
    );
    ```

3.  **Decode and Deserialize**: The data is returned as a base64 string. It needs to be decoded and then deserialized (using Borsh in this case) into a Dart object.
    ```dart
    final accountData = base64Decode(info.value!.data!.toJson()[0]);
    final playerProfile = PlayerProfile.fromAccountData(accountData);
    ```

### Creating and Sending Transactions

1.  **Define Instruction Data**: Create a Data Transfer Object (DTO) with the data required by your on-chain program's instruction. This DTO should have a `toBorsh()` method for serialization.
    ```dart
    final dto = CreatePlayerProfileDto(name: name);
    ```

2.  **Create an Instruction**: Use `AnchorInstruction.forMethod` to build the instruction.
    - `programId`: The public key of your on-chain program.
    - `method`: The name of the method in your program to call.
    - `accounts`: A list of `AccountMeta` objects that the instruction will use.
    - `arguments`: The serialized instruction data (e.g., `ByteArray(dto.toBorsh())`).
    ```dart
    final instruction = await AnchorInstruction.forMethod(
      programId: programId,
      method: 'create_player_profile',
      accounts: [ ... ],
      arguments: ByteArray(dto.toBorsh()),
    );
    ```

3.  **Compile the Message**: A transaction is composed of one or more instructions. These are compiled into a `Message`.
    - `recentBlockhash`: A recent blockhash is required for the transaction to be valid.
    - `feePayer`: The public key of the account that will pay the transaction fee.
    ```dart
    final latestBlockhash = await client.rpcClient.getLatestBlockhash();
    final message = Message(instructions: [instruction]);
    final compiledMessage = message.compileV0(
      recentBlockhash: latestBlockhash.value.blockhash,
      feePayer: playerPublicKey,
    );
    ```

4.  **Sign the Transaction**: The transaction must be signed by the fee payer. With MWA, we send the unsigned transaction to the wallet to be signed.
    ```dart
    final transaction = SignedTx(
        compiledMessage: compiledMessage,
        signatures: [Signature(Uint8List(64), publicKey: playerPublicKey)] // send empty 64 bytes which will be signed later
    );
    final unsignedTxBytes = base64Decode(transaction.encode());

    final signed = await mobileClient.signTransactions(
      transactions: [unsignedTxBytes],
    );
    final signedTx = signed.signedPayloads.first;
    ```

5.  **Send the Transaction**: The signed transaction is sent to the network.
    ```dart
    final sig = await client.rpcClient.sendTransaction(base64Encode(signedTx));
    ```

6.  **Confirm the Transaction**: You can wait for the transaction to be confirmed by the network.
    ```dart
    await client.waitForSignatureStatus(sig, status: Commitment.confirmed);
    ```

## Environment Variables

This project uses a `.env` file to manage environment variables. To get started, copy the `.env.example` file to a new file named `.env` and fill in the required values.

```bash
cp .env.example .env
```

The `.env` file is included in the `.gitignore` file, so it will not be committed to version control.

| Variable             | Description                                        |
| -------------------- | -------------------------------------------------- |
| `SOLANA_RPC_URL`       | The URL of the Solana RPC endpoint.                |
| `SOLANA_WEBSOCKET_URL` | The URL of the Solana websocket endpoint.          |
| `SOLANA_PROGRAM_ID`    | The ID of the on-chain program.                    |
| `APP_IDENTITY_URI`     | The URI that identifies your app for deep linking. |
| `APP_IDENTITY_NAME`    | The name of your app displayed to the user.        |
| `SOLANA_CLUSTER`       | The Solana cluster to connect to.                  |

## How to Run the App

1.  Ensure you have Flutter installed.
2.  Clone the repository.
3.  Run `flutter pub get` to install the dependencies.
4.  Run `flutter run` to launch the app on your device or emulator.

## Screenshots
<img width="482" height="1003" alt="Screenshot 2025-08-26 at 11 29 49 PM" src="https://github.com/user-attachments/assets/d6d512f1-6363-4111-9035-9f4d2b0e0d89" />
<img width="488" height="996" alt="Screenshot 2025-08-26 at 11 29 58 PM" src="https://github.com/user-attachments/assets/1f687ed5-772f-4da8-9435-631e57799359" />
<img width="480" height="998" alt="Screenshot 2025-08-26 at 11 30 23 PM" src="https://github.com/user-attachments/assets/bc01e588-5e3e-48e7-b7d6-71cf723753ba" />
<img width="484" height="1000" alt="Screenshot 2025-08-26 at 11 30 47 PM" src="https://github.com/user-attachments/assets/353d769c-6e0d-4959-9f3b-04a5456c9d40" />
<img width="486" height="1001" alt="Screenshot 2025-08-26 at 11 30 57 PM" src="https://github.com/user-attachments/assets/1c87c173-cdfc-4389-a8e8-d2dd7b56b83f" />


