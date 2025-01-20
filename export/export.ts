import { LM_LOVSANG_TEAM_ID, LM_SERVICE_TYPE_ID } from "@/config/pcConstants";
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

const exportPlans = async () => {
  console.log("Exporting plans");
  const result = await getPcEndpoint(
    `service_types/${LM_SERVICE_TYPE_ID}/plans`
  );
  for (const plan of result.data) {
    const { id, attributes } = plan;
    if (await prisma.plan.findFirst({ where: { pcId: id as string } }))
      continue;

    await prisma.plan.create({
      data: {
        pcId: id as string,
        title: (attributes.title as string | undefined) ?? "",
        date: new Date(attributes.sort_date as string),
        seriesTitle: (attributes.series_title as string | undefined) ?? "",
        url: attributes.planning_center_url as string,
      },
    });
  }
};

export const runExport = async () => {
  await exportPlans();
  await exportTeamMembers();
  await exportBlockouts();
};
