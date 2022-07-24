import { createClient } from "oicq";
import config from "./config.json";
import { accountService } from "./accountService";
import dayjs from "dayjs";
const account = config.qq;
const client = createClient(account);

const sleep = (delay) =>
  new Promise<void>((resolve) => setTimeout(resolve, delay));

client.on("system.online", async () => {
  await sleep(1000);
  client.logger.info("login");
  client.sendPrivateMsg(2601548431, ["online"]);
});
client.on("message.private", async (e) => {
  const { message, from_id } = e;
  const message_1 = message[0];
  if (message_1.type != "text") return;
  const { text } = message_1;
  if (text == "菜单") {
    client.sendPrivateMsg(
      from_id,
      `输入"账单"查询今日账单\n输入"本月账单"查询本月账单\n输入"记账 出行 10"进行记账`
    );
  }
  if (text == "账单") {
    const { data } = await accountService.listToday(from_id);
    const billings = data.data;
    if (billings.length == 0) {
      client.sendPrivateMsg(from_id, "今天还没有账单记录哦");
      return;
    }
    const strArr = billings.map((val) =>
      [
        `${dayjs(val.create_time).format(`MM/DD`)}`,
        `￥${val.price}`,
        `${val.category}`,
      ].join("\t")
    );
    strArr.push(
      `总支出：￥${billings
        .map((val) => val.price)
        .reduce((acc, val) => acc + val)}`
    );
    client.sendPrivateMsg(from_id, strArr.join("\n"));
  }
  if (text == "本月账单") {
    const { data } = await accountService.listMonth(from_id);
    const billings = data.data;
    if (billings.length == 0) {
      client.sendPrivateMsg(from_id, "今天还没有账单记录哦");
      return;
    }
    const strArr = billings.map((val) =>
      [
        `${dayjs(val.create_time).format(`MM/DD`)}`,
        `￥${val.price}`,
        `${val.category}`,
      ].join("\t")
    );
    strArr.push(
      `总支出：￥${billings
        .map((val) => val.price)
        .reduce((acc, val) => acc + val)}`
    );
    client.sendPrivateMsg(from_id, strArr.join("\n"));
  }
  if (/^记账 .+? [0-9]+(\.[0-9]+)?$/.test(text)) {
    const [_, category, amountStr] = text.split(" ");
    const amount = Number.parseInt(amountStr);
    if (isNaN(amount)) {
      client.sendPrivateMsg(from_id, "处理错误！");
      return;
    }
    const { data } = await accountService.addBilling(from_id, category, amount);
    if (data.code != 200000) {
      client.sendPrivateMsg(from_id, data.msg);
      return;
    }
    return client.sendPrivateMsg(from_id, "记录成功");
  }
});

client
  .on("system.login.slider", function (e) {
    console.log("输入ticket：");
    process.stdin.once("data", (ticket) =>
      this.submitSlider(String(ticket).trim())
    );
  })
  .login(config.password);
