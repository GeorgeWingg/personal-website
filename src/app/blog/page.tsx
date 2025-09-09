'use client';

import GameFrame from '@/components/GameUI/GameFrame';
import ContentPanel from '@/components/GameUI/ContentPanel';
import LinkDock from '@/components/GameUI/LinkDock';
import BlogPanel from '@/components/Panels/BlogPanel';

export default function BlogPage() {
  return (
    <GameFrame>
      <div className="h-full flex flex-col">
        <div className="flex-1 h-full p-4 md:p-6 overflow-y-auto">
          <ContentPanel isActive={true}>
            <BlogPanel isActive={true} />
          </ContentPanel>
        </div>
        <LinkDock />
      </div>
    </GameFrame>
  );
}

