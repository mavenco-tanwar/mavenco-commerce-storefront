import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InstagramIcon } from '@/components/ui/SocialIcons';

export function InstagramFeed() {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop',
      likes: '1.4k',
      tag: '#JQWomen',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=500&auto=format&fit=crop',
      likes: '980',
      tag: '#JQKids',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=500&auto=format&fit=crop',
      likes: '2.1k',
      tag: '#SummerSoiree',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500&auto=format&fit=crop',
      likes: '1.8k',
      tag: '#LinenStyle',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=500&auto=format&fit=crop',
      likes: '1.2k',
      tag: '#LittleRoyals',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop',
      likes: '3.4k',
      tag: '#JQAccessories',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F2] border-t border-[#E8DED8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
              Community &amp; Inspiration
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1">
              Follow the JQ Style
            </h2>
            <p className="text-sm text-[#777777] font-sans mt-1">
              Tag <strong className="text-[#111111]">@jqtrends</strong> and #JQStyle to be featured in our lookbook.
            </p>
          </div>

          <a
            href="https://instagram.com/jqtrends"
            target="_blank"
            rel="noopener noreferrer"
            className="self-center sm:self-auto"
          >
            <Button
              variant="outline"
              size="md"
              leftIcon={<InstagramIcon className="w-4 h-4 text-[#B77A68]" />}
            >
              Follow Us @jqtrends
            </Button>
          </a>
        </div>

        {/* 6-Photo Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/jqtrends"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] block"
            >
              <Image
                src={post.image}
                alt="JQ Trends Instagram Fashion"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 text-white p-2">
                <InstagramIcon className="w-5 h-5 text-[#E8B8B5]" />
                <span className="text-[10px] font-bold tracking-wider">{post.tag}</span>
                <span className="flex items-center gap-1 text-[10px] text-[#E8DED8]">
                  <Heart className="w-3 h-3 fill-[#C98282] text-[#C98282]" /> {post.likes}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
