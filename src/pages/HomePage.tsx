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

export default function HomePage() {
  const { getTrendingProducts, products } = useProductStore();
  const trendingProducts = getTrendingProducts();
  const { theme } = useTheme();
  const navigate = useNavigate(); // Add this line

  // Get featured products (new items or items with high stock)
  const featuredProducts = products
    .filter(product => {
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
      return totalStock > 50 || new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
    })
    .slice(0, 10);

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
              Discover Your Style
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Explore our latest collection of trendsetting fashion
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
              <div key={product.id} className={`${styles.bentoItem} ${styles[`bentoItem${index + 1}`]}`}>
                <HomepageProductCard product={product} /> {/* Use the new component here */}
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
