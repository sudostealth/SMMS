import ImportStudentClient from "./import-client";

interface ImportStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ImportStudentPage({ params }: ImportStudentPageProps) {
  const { id } = await params;
  return <ImportStudentClient batchId={id} />;
}
