import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselContent,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const mockItems = [
  "Direct Observation of Terrence Gregory",
  "Capstone 2024 PGY2",
];

export function ResponseSelectSidebar() {
  return (
    <aside className="h-full w-[332px] border-r border-accent-secondary bg-zinc-100 p-2 shadow-inner">
      <FormCodeSelect />
    </aside>
  );
}
function FormCodeSelect() {
  return (
    <Carousel>
      <CarouselContent className="h-24">
        {mockItems.map((item) => (
          <CarouselItem
            key={item}
            className="flex w-full select-none flex-col items-center "
          >
            <div className="mt-4 flex w-full flex-row items-center justify-between">
              <CarouselPrevious variant="hide" />
              <p className="-mt-8 text-foreground/70">June 16, 2024</p>
              <CarouselNext variant="hide" />
            </div>
            <p className="text-md truncate text-wrap text-center font-medium">
              {item}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function ResponseCard() {
  return <div>this is a response</div>;
}
