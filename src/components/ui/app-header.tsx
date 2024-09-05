import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import Image from 'next/image';
import LOGO from 'public/logo-reversed.svg';

export function AppHeader() {
  return (
    <div className="flex bg-primary min-h-12 max-h-12 space-x-6 justify-between min-w-screen flex-row items-center pr-4">
      <MainMenuBar />
      <Image src={LOGO} alt="logo" width={150} height={75} />
    </div>
  );
}

function MainMenuBar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">F</span>ile
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarItem>Rename</MenubarItem>
          <MenubarItem>Export</MenubarItem>
          <MenubarItem>Import</MenubarItem>
          <MenubarItem>Save</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">E</span>dit
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⌘Y</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy<MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste<MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">I</span>nsert
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Add Question</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Single Choice</MenubarItem>
              <MenubarItem>Multiple Choice</MenubarItem>
              <MenubarItem>Written</MenubarItem>
              <MenubarItem>Range</MenubarItem>
              <MenubarItem>Header</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          F<span className="underline">o</span>rm
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Change Program</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Properties</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Edit Access</MenubarItem>
              <MenubarItem>Assessment Access</MenubarItem>
              <MenubarItem>Allow Response Revisions</MenubarItem>
              <MenubarItem>Allow Multiple Responses</MenubarItem>
              <MenubarItem>Allow Save & Quit</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">S</span>coring
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Set Passing Criteria</MenubarItem>
          <MenubarItem>Set Role Weights</MenubarItem>
          <MenubarItem>Set Competency Weights</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">A</span>ssessments
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Request Responses</MenubarItem>
          <MenubarItem>Manage Active Assessments</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">T</span>ools
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Generate Report</MenubarItem>
          <MenubarItem>View Competency Map</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <span className="underline">H</span>elp
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Video Tutorials</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
          <MenubarItem>Contact Support</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
