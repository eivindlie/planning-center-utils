import { LM_LOVSANG_TEAM_ID } from "@/config/pcConstants";
import { getPcEndpoint } from "./pcClient";
import prisma from "@/prisma/client";

const exportTeamMembers = async () => {
  const result: any = await getPcEndpoint(
    `teams/${LM_LOVSANG_TEAM_ID}?include=people`
  );
  for (const person of result.included) {
    if (person.type !== "Person") continue;

    const { id, attributes } = person;
    if (await prisma.member.findFirst({where: {pcId: id}})) continue;

    await prisma.member.create({
        data: {
            pcId: id,
            name: attributes.full_name,
        }
    })
  }
};

export const runExport = async () => {
  await exportTeamMembers();
};
