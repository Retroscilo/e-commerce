import Head from "next/head";
import Product from "../components/Product";
import prisma from "../lib/prisma";
import Header from "../components/Header";

export default function Home({ products, categories }) {
  return (
    <div>
      <Head>
        <title>PlanetScale Next.js Quickstart</title>
        <meta name="description" content="PlanetScale Quickstart for Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="p-10 mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 text-center">Next.js Starter</h1>
        <p className="mb-20 text-xl text-center">
          🔥 Shop from the hottest items in the world 🔥
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
          {products &&
            products.map((product) => (
              <Product
                categories={categories}
                product={product}
                key={product.id}
              />
            ))}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps(context) {
  const random = await prisma.product.findMany({
    include: {
      categories: true,
    },
  });

  //convert decimal value to string to pass through as json
  const products = random.map((product) => ({
    ...product,
    categories: JSON.parse(JSON.stringify(product.categories)),
  }));

  console.log(products);

  // Get all categories
  const categories = await prisma.category.findMany({});

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
