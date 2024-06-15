"use client";
import {
  BentoCard,
  BentoCardProps,
  BentoGrid,
} from "@/components/magicui/bento-grid";
import ICS from "public/icons/ics-bubbles-icon.json";
import SBP from "public/icons/sbp-nodes-icon.json";
import P from "public/icons/p-icon.json";
import MK from "public/icons/mk-mask-icon.json";
import PC from "public/icons/pc-heart-icon.json";
import PBLI from "public/icons/pbli-icon.json";
import HOSPITAL from 'public/image/hospital.jpg'
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Curve,
  Radar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { BoxesIcon, GroupIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import GaugeCircle from "@/components/magicui/gauge-circle";
import { COMPETENCIES } from "@/db/constants";
import { CompetencyGauge } from "@/components/(admin)/forms/responses/competency-gauges";
import { random } from "lodash";
import GaugeChart from "@/components/ui/gauge";
import Lottie from "lottie-react";
import { LottieHover } from "@/components/ui/lottie-hover";
import Marquee from "@/components/magicui/marquee";
import MALE_DOCTOR_1 from "public/image/male-doctor-1.png";
import MALE_DOCTOR_2 from "public/image/male-doctor-2.png";
import MALE_DOCTOR_3 from "public/image/male-doctor-3.png";
import FEMALE_DOCTOR_1 from "public/image/female-doctor-1.png";
import FEMALE_DOCTOR_2 from "public/image/female-doctor-2.png";
import FEMALE_DOCTOR_3 from "public/image/female-doctor-3.png";
import DENTIST from "public/image/dentist.png";
import Image from "next/image";

export default function ProgramsPage() {
  const features: BentoCardProps[] = [
    {
      name: "Family Medicine Residency",
      description: "Your Institution's Family Medicine Residency.",
      background: <Image src={HOSPITAL} alt={"Hospital"} width={800} height={500} className={cn("blur-lg")} />,
      className: "col-span-3",
      cta: "See More",
      Icon: GroupIcon,
    },
    {
      name: "People",
      description: "View and manage people in this program.",
      Icon: UserIcon,
      cta: "Manage People",
      className: "col-span-2",
      background: (
        <div className={cn("opacity-30 blur-sm")}>
          <Marquee className={cn("grayscale")}>
            <Image src={DENTIST} alt={"male doc"} width={250} height={250} />
            <Image
              src={MALE_DOCTOR_1}
              alt={"male doc"}
              width={250}
              height={250}
            />
            <Image
              src={FEMALE_DOCTOR_1}
              alt={"male doc"}
              width={250}
              height={250}
            />
            <Image
              src={MALE_DOCTOR_2}
              alt={"male doc"}
              width={250}
              height={250}
            />
            <Image
              src={FEMALE_DOCTOR_3}
              alt={"male doc"}
              width={250}
              height={250}
            />
            <Image src={DENTIST} alt={"male doc"} width={250} height={250} />
            <Image
              src={MALE_DOCTOR_3}
              alt={"male doc"}
              width={250}
              height={250}
            />

            <Image
              src={FEMALE_DOCTOR_2}
              alt={"male doc"}
              width={250}
              height={250}
            />
          </Marquee>

        </div>
      ),
    },
    {
      name: "New Program",
      description: "Create a program or join an existing one.",
      Icon: BoxesIcon,
      className: "col-span-2",
      cta: "Add or Join Program",
    },
  ];
  return (
    <div className="h-full w-full xs:px-4 lg:p-8">
      <BentoGrid>
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
        <CompetencyGaugeGroup />
        <CompetencyRadialChart />
      </BentoGrid>
    </div>
  );
}

function CompetencyGaugeGroup() {
  return (
    <div className={cn("col-span-5")}>
      <div className={cn("grid h-full w-full grid-cols-3 place-items-center")}>
        <GaugeChart
          value={random(0, 100)}
          size="sm"
          color="foreground"
          icon={<LottieHover src={ICS} />}
        />
        <GaugeChart
          value={random(0, 100)}
          size="sm"
          color="foreground"
          icon={<LottieHover src={SBP} />}
        />
        <GaugeChart
          value={random(0, 100)}
          size="sm"
          color="foreground"
          icon={<LottieHover src={PBLI} />}
        />
        <GaugeChart
          value={random(0, 100)}
          size="sm"
          color="foreground"
          icon={<LottieHover src={MK} />}
        />
        <GaugeChart
          value={random(0, 100)}
          size="sm"
          color="foreground"
          icon={<LottieHover src={PC} />}
        />
        <GaugeChart
          value={random(0, 100)}
          size="sm"
          color="foreground"
          icon={<LottieHover src={P} />}
        />
      </div>
    </div>
  );
}

function CompetencyDataDisplayGroup() {
  return <></>;
}

const lineChartData = [
  {
    competencyName: "ICS",
    x: "Jan '23",
    y: 10,
  },
  {
    competencyName: "ICS",
    x: "Jun '23",
    y: 15,
  },
  {
    competencyName: "ICS",
    x: "Jan '24",
    y: 7,
  },
  {
    competencyName: "ICS",
    x: "Jun '24",
    y: 5,
  },
  {
    competencyName: "ICS",
    x: "Jan '25",
    y: 8,
  },
];
// TODO Make an 'AnimatedContainer' component
function CompetencyLineChart() {
  return (
    <ResponsiveContainer
      className={"col-span-5 rounded-sm bg-gray-200/40"}
      width={"100%"}
      height={"100%"}
    >
      <LineChart
        title={"Medical Knowledge"}
        data={lineChartData}
        className={cn("-ml-6 mt-1 text-xs")}
      >
        <Legend />
        <Tooltip />
        <XAxis dataKey={"x"} />
        <YAxis dataKey={"y"} />
        <Line type={"monotone"} dataKey={"y"} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const data = [
  {
    subject: "ICS",
    A: 34,
    B: 48,
    fullMark: 100,
  },
  {
    subject: "SBP",
    A: 57,
    B: 89,
    fullMark: 100,
  },
  {
    subject: "PBLI",
    A: 73,
    B: 55,
    fullMark: 100,
  },
  {
    subject: "P",
    A: 30,
    B: 66,
    fullMark: 100,
  },
  {
    subject: "MK",
    A: 29,
    B: 33,
    fullMark: 100,
  },
  {
    subject: "PC",
    A: 65,
    B: 100,
    fullMark: 100,
  },
];

function CompetencyRadialChart() {
  return (
    <ResponsiveContainer
      className={
        "col-span-2 col-start-6 rounded-sm bg-gray-200/30 drop-shadow-lg"
      }
      width="100%"
      height="100%"
    >
      <RadarChart
        className={cn("drop-shadow-2xl")}
        cx="50%"
        cy="50%"
        outerRadius="80%"
        data={data}
      >
        <Tooltip />
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          name="Jan '23"
          dataKey="A"
          fill="hsl(204, 95%, 43%)"
          fillOpacity={0.3}
        />
        <Radar
          name="Jan '25"
          dataKey="B"
          fill="hsl(150, 79%, 39%)"
          fillOpacity={0.3}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
