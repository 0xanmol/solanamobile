use anchor_lang::prelude::*;

declare_id!("DgQs1qXHvkbBKJwgVP9DcS4EzN48beF9AEw5UpiCBSS3");

#[program]
pub mod coin_toss_contract {
    use super::*;

    pub fn create_player_profile(ctx: Context<CreatePlayerProfile>, name: String) -> Result<()> {
        let player_profile = &mut ctx.accounts.player_profile;
        player_profile.name = name;
        player_profile.player = ctx.accounts.player.key();
        player_profile.total_played = 0;
        player_profile.total_won = 0;
        Ok(())
    }

    pub fn execute_toss(ctx: Context<UpdatePlayerProfile>, won: bool) -> Result<()> {
        let player_profile = &mut ctx.accounts.player_profile;
        player_profile.total_played += 1;
        if won {
            player_profile.total_won += 1;
        }
        Ok(())

    }
}

// CONTEXTS ------------------------------------

#[derive(Accounts)]
pub struct CreatePlayerProfile<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + PlayerProfile::INIT_SPACE,
        seeds = [b"profile", player.key().as_ref()],
        bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct UpdatePlayerProfile<'info> {
    #[account(
        mut,
        seeds = [b"profile", player.key().as_ref()],
        bump,
        has_one = player @ ErrorCode::UnauthorizedAccess
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    pub player: Signer<'info>,
}

// STATE --------------------------------------
#[account]
#[derive(Default, Debug, PartialEq, InitSpace)]
pub struct PlayerProfile {
    #[max_len(32)]
    pub name: String,
    pub player: Pubkey,
    pub total_played: u64,
    pub total_won: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    UnauthorizedAccess,
}
