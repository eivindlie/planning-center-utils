import { LM_LOVSANG_TEAM_ID } from "@/config/pcConstants";
import { getPcEndpoint } from "./pcClient";
import prisma from "@/prisma/client";

const exportTeamMembers = async () => {
  console.log("Exporting team members");
  const result: any = await getPcEndpoint(
    `teams/${LM_LOVSANG_TEAM_ID}?include=people`
  );
  for (const person of result.included) {
    if (person.type !== "Person") continue;

    const { id, attributes } = person;
    if (await prisma.member.findFirst({ where: { pcId: id } })) continue;

    await prisma.member.create({
      data: {
        pcId: id,
        name: attributes.full_name,
      },
    });
  }
};

const exportBlockouts = async () => {
  console.log("Exporting blockouts");
  const members = await prisma.member.findMany();
  for (const member of members) {
    console.log(`Exporting blockouts for ${member.name}`);
    const result = await getPcEndpoint(`people/${member.pcId}/blockouts`);
    for (const blockout of result.data) {
      const { id, attributes } = blockout;
      if (await prisma.blockout.findFirst({ where: { pcId: id as string } }))
        continue;

      await prisma.blockout.create({
        data: {
          member: {
            connect: {
              id: member.id,
            },
          },
          pcId: id as string,
          startsAt: new Date(attributes.starts_at as string),
          endsAt: new Date(attributes.ends_at as string),
          reason: attributes.reason as string | undefined,
        },
      });
    }
  }
};

export const runExport = async () => {
  await exportTeamMembers();
  await exportBlockouts();
};
