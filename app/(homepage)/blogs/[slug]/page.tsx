
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return (
    <section className="container mx-auto py-8 px-4 max-w-7xl">
      <h1>Blog slug {slug}</h1>
    </section>
  );
};

export default page;
