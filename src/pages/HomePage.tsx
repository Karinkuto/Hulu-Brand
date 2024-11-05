// @ts-nocheck
import React from "react";
import { useProductStore } from "@/stores/productStore";
import { Container } from "@mui/material";
import { HomepageProductCard } from "@/components/HomepageProductCard"; // Update this import
import { FeaturedProductCarousel } from "@/components/FeaturedProductCarousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star } from "lucide-react";
import ShineBorder from "@/components/magicui/shine-border";
import Particles from "@/components/magicui/particles";
import { useTheme } from "@/components/theme-provider";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom"; // Add this import
import { fetchProducts } from "@/stores/productStore";

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = React.useState([]);
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const { getTrendingProducts, products } = useProductStore();
  const { theme } = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchProducts().then((fetchedProducts) => {
      console.log(fetchedProducts);

      setTrendingProducts(fetchedProducts.slice(0, 8));
      setFeaturedProducts(fetchedProducts);
    });
  }, []);

  const handleShopNowClick = () => {
    navigate("/products"); // Updated to route to the products page
  };

  return (
    <Container maxWidth="xl">
      <div className={styles.homePage}>
        {/* Hero Section */}
        <ShineBorder
          className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl mb-12"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <div className={styles.heroContent}>
            <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
              HuluBrand
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Quality first
            </p>
            <Button size="lg" className="mt-8" onClick={handleShopNowClick}>
              Shop Now <ArrowRight className="ml-2" />
            </Button>
          </div>
          <Particles
            className="absolute inset-0"
            quantity={100}
            ease={80}
            color={theme === "dark" ? "#ffffff" : "#000000"}
            refresh={false}
          />
        </ShineBorder>

        {/* Trending Products Bento Grid */}
        <section className={styles.bentoGrid}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp className="inline-block mr-2" />
            Trending Products
          </h2>
          <div className={styles.bentoContainer}>
            {trendingProducts.slice(0, 9).map((product, index) => (
              <div
                key={product.id}
                className={`${styles.bentoItem} ${
                  styles[`bentoItem${index + 1}`]
                }`}
              >
                <HomepageProductCard product={product} />{" "}
                {/* Use the new component here */}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Carousel */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>
            <Star className="inline-block mr-2" />
            Featured Products
          </h2>
          <FeaturedProductCarousel products={featuredProducts} />
        </section>
      </div>
    </Container>
  );
}
