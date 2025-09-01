use anchor_lang::prelude::*;

declare_id!("9S7z9xojyDARK3kqaDRhcabHA4sWERWMmQ31DbB9uVde");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
