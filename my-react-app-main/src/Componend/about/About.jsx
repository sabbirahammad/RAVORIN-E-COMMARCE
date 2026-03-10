import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#121318] px-6 py-12 text-white md:px-20">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">About Ravorion</h1>
        <p className="text-lg text-gray-300">
          Discover the story, mission, and design focus behind Ravorion, a fashion brand built for
          modern pants, t-shirts, and everyday confident style.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 text-base leading-relaxed text-gray-300 md:text-lg">
        <section>
          <h2 className="mb-2 text-2xl font-semibold text-yellow-400">Who We Are</h2>
          <p>
            Ravorion is a contemporary fashion brand focused on premium pants, t-shirts, and
            essential casualwear designed for sharp fits, comfort, and everyday versatility. Our
            collections are made for customers who want clean design, wearable fashion, and a strong
            sense of personal style.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold text-yellow-400">Our Mission</h2>
          <p>
            Our mission is to deliver fashion that feels modern, dependable, and easy to wear. We
            believe clothing should combine strong fabric quality, comfortable construction, and
            stylish silhouettes so every customer can dress with confidence from day to night.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold text-yellow-400">What We Offer</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Premium pants with modern fits for casual and elevated everyday looks</li>
            <li>Comfortable t-shirts designed for layering, styling, and daily wear</li>
            <li>Fashion-forward essentials with clean details and versatile colors</li>
            <li>Reliable quality, practical comfort, and customer-first service</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold text-yellow-400">Our Design Focus</h2>
          <p>
            Every Ravorion piece is developed with attention to fit, fabric, and finish. From
            structured pants to relaxed t-shirts, we focus on balance between trend and practicality
            so the collection stays stylish without losing comfort or wearability.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold text-yellow-400">Why Choose Ravorion?</h2>
          <p>
            Because Ravorion is created for people who want fashion that looks current and feels
            effortless. We combine modern cuts, trusted materials, and strong visual identity to
            offer clothing that supports confidence, simplicity, and everyday expression.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
