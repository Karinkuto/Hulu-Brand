import React from "react";
import { useProductStore } from "../stores/productStore";
import { Container } from "@mui/material";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star, Clock } from "lucide-react";
import ShineBorder from "@/components/magicui/shine-border";
import Particles from "@/components/magicui/particles";
import { useTheme } from "@/components/theme-provider";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { featuredProducts, getTrendingProducts } = useProductStore();
  const trendingProducts = getTrendingProducts();
  const { theme } = useTheme();

  return (
    <Container maxWidth="xl">
      <div className={styles.homePage}>
        {/* Hero Section with ShineBorder and Particles */}
        <ShineBorder
          className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <div className={styles.heroContent}>
            <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
              Discover Your Style
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Explore our latest collection of trendsetting fashion
            </p>
            <Button size="lg" className="mt-8">
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

        {/* Featured Products Bento Grid */}
        <section className={styles.bentoGrid}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <div className={styles.bentoContainer}>
            {featuredProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className={`${styles.bentoItem} ${styles[`bentoItem${index + 1}`]}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Trending Now Section */}
        <section className={styles.trendingSection}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp className="inline-block mr-2" />
            Trending Now
          </h2>
          <div className={styles.trendingGrid}>
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories Showcase */}
        <section className={styles.categoriesShowcase}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoriesGrid}>
            {['Women', 'Men', 'Accessories', 'Shoes'].map((category) => (
              <div key={category} className={styles.categoryCard}>
                <h3>{category}</h3>
                <Button variant="outline">Explore</Button>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals Carousel */}
        <section className={styles.newArrivals}>
          <h2 className={styles.sectionTitle}>
            <Clock className="inline-block mr-2" />
            New Arrivals
          </h2>
          {/* Implement a carousel component here */}
          <div className={styles.arrivalsCarousel}>
            {/* Placeholder for carousel items */}
          </div>
        </section>

        {/* Customer Favorites */}
        <section className={styles.customerFavorites}>
          <h2 className={styles.sectionTitle}>
            <Star className="inline-block mr-2" />
            Customer Favorites
          </h2>
          <div className={styles.favoritesGrid}>
            {featuredProducts.slice(5, 9).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
