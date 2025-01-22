import { Member, Blockout } from "@prisma/client";

export type MemberWithBlockouts = Member & { blockouts: Blockout[] };
