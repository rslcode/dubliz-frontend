import React from 'react'
import Image from 'next/image'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import useGlobalContext from '@/hooks/use-context'
import { BASE_URL } from '@/core/config'

export const AuctionMarkerAssets = (props: { isExtended?: boolean; path: string }) => {
  const { isExtended = false, path } = props
  const serverBaseURL = BASE_URL
  const globalContext = useGlobalContext()
  const { defaultProductImageUrl } = globalContext.appSettings

  return (
    <div className={`photo-gallery ${isExtended ? 'extended' : ''}`}>
      <Image
        alt="auction asset"
        width={50}
        height={50}
        src={path !== '' ? `${serverBaseURL}/assets/${path}` : DefaultAssetImage.src}
        style={{ borderRadius: 4 }}
      />
      <div className="gallery-navigation">
        <Image
          alt="auction asset"
          fill
          src={
            path !== ''
              ? `${serverBaseURL}/assets/${path}`
              : defaultProductImageUrl?.length
                ? defaultProductImageUrl
                : DefaultAssetImage.src
          }
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      </div>
    </div>
  )
}
