import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import {
  convertHourStringToMinutes,
  convertMinutesToHourString,
} from "./utils/convert-hours";
import { registerAds } from "./validation/registerAds";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  return res.status(200).json(games);
});

app.post("/games/:id/ads", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    await registerAds.validate(body);

    const ad = await prisma.ad.create({
      data: {
        gameId: id,
        name: body.name,
        discord: body.discord,
        yearsPlaying: body.yearsPlaying,
        weekDays: body.weekDays.join(","),
        hourStart: convertHourStringToMinutes(body.hourStart),
        hourEnd: convertHourStringToMinutes(body.hourEnd),
        useVoiceChannel: body.useVoiceChannel,
      },
    });

    return res.status(201).json(ad);
  } catch (error: any) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

app.get("/games/:id/ads", async (req, res) => {
  const { id } = req.params;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourEnd: true,
      hourStart: true,
    },
    where: {
      gameId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hourStart: convertMinutesToHourString(ad.hourStart),
        hourEnd: convertMinutesToHourString(ad.hourEnd),
      };
    })
  );
});

app.get("/ads/:id/discord", async (req, res) => {
  const { id } = req.params;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id,
    },
  });
  return res.status(200).json({ discord: ad.discord });
});

app.listen(3334);
