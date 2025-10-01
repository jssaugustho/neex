import accountData from "../../config/account-data.json" with { type: "json" };

type iConfig = {
  BOT_ID: string;
  SELLER_ID: string;
  MANAGEMENT_BOT_ID: string;
};

let config: iConfig = {
  BOT_ID: "",
  SELLER_ID: "",
  MANAGEMENT_BOT_ID: "",
};

config.BOT_ID = accountData.BOT_ID;
config.SELLER_ID = accountData.SELLER_ID;
config.MANAGEMENT_BOT_ID = accountData.MANAGEMENT_BOT_ID;

export default config as iConfig;
