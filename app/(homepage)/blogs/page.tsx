import AllBlogsMainWrapper from './_components/all-blogs-main-wrapper';

const page = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* top section */}
      <section className="space-y-5">
        <h3 className="text-4xl font-bold">Engineering blog</h3>
        <p className="font-medium">
          Insights on system design, performance optimization, and modern web
          development
        </p>
      </section>

      {/* blogs */}
      <AllBlogsMainWrapper />
    </div>
  );
};

export default page;
