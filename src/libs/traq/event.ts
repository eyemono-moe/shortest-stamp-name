import * as v from "valibot";

const userSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  displayName: v.string(),
  iconId: v.pipe(v.string(), v.uuid()),
  bot: v.boolean(),
});

export const embedUserSchema = v.object({
  type: v.literal("user"),
  raw: v.string(),
  id: v.pipe(v.string(), v.uuid()),
});
export const embedChannelSchema = v.object({
  type: v.literal("channel"),
  raw: v.string(),
  id: v.pipe(v.string(), v.uuid()),
});

const embedSchema = v.union([embedUserSchema, embedChannelSchema]);

const messageSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  user: userSchema,
  channelId: v.pipe(v.string(), v.uuid()),
  text: v.string(),
  plainText: v.string(),
  embedded: v.array(embedSchema),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export const bodySchema = v.object({
  eventTime: v.pipe(v.string(), v.isoTimestamp()),
  message: messageSchema,
});
