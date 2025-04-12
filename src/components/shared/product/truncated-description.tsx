'use client';

import React from 'react';
import { useState } from 'react';

const TruncatedDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 180;
  const isTruncated = description.length > maxLength;

  const displayText = !isExpanded && isTruncated ? `${description.slice(0, maxLength)}...` : description;

  if (!isTruncated) return <p className="text-sm sm:text-base">{description}</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm sm:text-base">
        {displayText}
        <span onClick={() => setIsExpanded(!isExpanded)} className="font-bold text-primary hover:cursor-pointer hover:text-primary/80">
          {isExpanded ? ' See Less' : ' See More'}
        </span>
      </p>
    </div>
  );
};

export default TruncatedDescription;
