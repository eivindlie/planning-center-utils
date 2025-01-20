import prisma from "@/prisma/client";

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({orderBy: {date: "desc"}});

  return (
    <div>
      <h1>Plans</h1>

      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            <a href={plan.url}>
                {plan.date.toDateString()}&nbsp;&mdash;&nbsp;
                {plan.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
