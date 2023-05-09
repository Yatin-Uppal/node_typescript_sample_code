import * as fs from "fs";
import * as randomstring from "randomstring";
import * as redisIndex from "redis-index";
import { now } from "lodash";

var primaryKey = "chat_pk";
//var index = redisIndex.createIndex();

var redisIndexOverride = () =>
  redisIndex.obtainClient({
    url: "redis://" + process.env.REDIS_PASSWORD + "@" + process.env.REDIS_IP + ":" + process.env.REDIS_PORT,
    key: process.env.REDIS_CLIENTNAMESPACE,
    index: primaryKey,
  });

class Redis {
  private client;

  constructor() {}

  public async saveDataInCache(
    userId,
    data,
    file,
    callback
  ): Promise<any> {
 
     var index = redisIndex.createIndex({
      obtainClient: redisIndexOverride,
      key: process.env.REDIS_CLIENTNAMESPACE ,
      index: primaryKey,
    });

    let k =
      Date.now() + randomstring.generate({ length: 4, charset: "alphabetic" });

    let chatBins = {
      chat_pk: k,
      chatRoomId: data.chatRoomId,
      userId: userId,
      recieverId: data.recieverId,
      message: data.message,
      createdAt: data.createdAt,
      readStatus: 0,
      file: file
    };

    index.add(chatBins, (err, result) => {

      if (err) return callback(true, null);
      return callback(false, chatBins);
    });
    return callback(true, null);
  }

  public async getChatRoomFromCache(chatRoomId, callback): Promise<any> {
    
     var index = redisIndex.createIndex({
      obtainClient: redisIndexOverride,
      key: process.env.REDIS_CLIENTNAMESPACE ,
      index: primaryKey,
    });

    index
      .search({ chatRoomId: chatRoomId })
      .sort("createdAt", "asc")
      .exec(function (err, result) {
        if (err) return callback(true, null);
        return callback(false, result);
      });
    return callback(true, null);
  }
}
export default Redis;
