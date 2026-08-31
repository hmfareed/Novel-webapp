import { redirect } from "next/navigation";

interface ReadSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReadSlugPage({ params }: ReadSlugPageProps) {
  const { slug } = await params;
  redirect(`/read/${slug}/1`);
}
