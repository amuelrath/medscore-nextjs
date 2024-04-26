import FormViewerSection from "@/components/(evaluations)/sections/form-viewer";
import Section from "@/components/ui/section";
import NavBar from "@/components/ui/top-navbar";

export default async function SecureEvaluationsHomePage() {
  return (
    <>
      <NavBar>
        <NavBar.Heading>
          <NavBar.Title>Evaluations</NavBar.Title>
        </NavBar.Heading>
      </NavBar>
      <Section>
        <FormViewerSection />
      </Section>
    </>
  );
}
