import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Msgapp } from "../target/types/msgapp";

const assert = require("assert");
const { SystemProgram } = anchor.web3;

describe("msgapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Msgapp as Program<Msgapp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});

it("Can create a message", async () => {
  const message = anchor.web3.Keypair.generate();
  const messageContent = "Hello World!";
  const program = anchor.workspace.Msgapp as Program<Msgapp>;
  await program.rpc.createMessage(messageContent, {
    accounts: {
      message: message.publicKey,
      author: anchor.getProvider().wallet.publicKey,
      // author: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [message],
  });


  const messageAccount = await program.account.message.fetch(
    message.publicKey
  );


  assert.equal(
    messageAccount.author.toBase58(),
    // provider.wallet.publicKey.toBase58()
    anchor.getProvider().wallet.publicKey,
  );
  assert.equal(messageAccount.content, messageContent);
  assert.ok(messageAccount.timestamp);
});
