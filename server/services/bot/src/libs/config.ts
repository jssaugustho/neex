import accountData from "../../config/account-data.json" with { type: "json" };

type iConfig = {
  BOT_ID: string;
  SELLER_ID: string;
};

let config: iConfig = {
  BOT_ID: "",
  SELLER_ID: "",
};

config.BOT_ID = accountData.BOT_ID;
config.SELLER_ID = accountData.SELLER_ID;

export default config as iConfig;
