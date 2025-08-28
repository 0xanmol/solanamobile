import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CoinTossContract } from "../target/types/coin_toss_contract";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import assert from "assert";

describe("coin_toss_contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CoinTossContract as Program<CoinTossContract>;
  const player = Keypair.generate();

  let playerProfilePda: PublicKey;

  before(async () => {
    // Airdrop SOL to the player account
    const signature = await provider.connection.requestAirdrop(
      player.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL // 10 SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Find the PDA for the player profile before tests
    [playerProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), player.publicKey.toBuffer()],
      program.programId
    );
  });

  it("creates a player profile and verifies its data", async () => {
    const playerName = "Alice";

    // Create the player profile
    await program.methods
      .createPlayerProfile(playerName)
      .accounts({
        playerProfile: playerProfilePda,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    // Fetch the created account
    const playerProfile = await program.account.playerProfile.fetch(
      playerProfilePda
    );

    // Check the data
    assert.strictEqual(playerProfile.name, playerName, "Player name does not match");
    assert.ok(playerProfile.player.equals(player.publicKey), "Player public key does not match");
    assert.strictEqual(playerProfile.totalPlayed.toNumber(), 0, "Initial total_played should be 0");
    assert.strictEqual(playerProfile.totalWon.toNumber(), 0, "Initial total_won should be 0");
  });

  it("executes tosses and verifies profile updates", async () => {
    // Execute a winning toss
    await program.methods
      .executeToss(true)
      .accounts({
        playerProfile: playerProfilePda,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    let playerProfile = await program.account.playerProfile.fetch(
      playerProfilePda
    );

    // Check the data after winning
    assert.strictEqual(playerProfile.totalPlayed.toNumber(), 1, "total_played should be 1 after winning toss");
    assert.strictEqual(playerProfile.totalWon.toNumber(), 1, "total_won should be 1 after winning toss");

    // Execute a losing toss
    await program.methods
      .executeToss(false)
      .accounts({
        playerProfile: playerProfilePda,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    playerProfile = await program.account.playerProfile.fetch(
      playerProfilePda
    );

    // Check the data after losing
    assert.strictEqual(playerProfile.totalPlayed.toNumber(), 2, "total_played should be 2 after losing toss");
    assert.strictEqual(playerProfile.totalWon.toNumber(), 1, "total_won should be 1 after losing toss");
  });
});