import type { NextApiRequest, NextApiResponse } from 'next'
import { withSentry } from '@sentry/nextjs'

type EthNFT = {
	contract: {
		address: string
	}
	id: {
		tokenMetadata: {
			tokenType: string
		}
	}
	balance: string
	title: string
	description: string
	media: { raw: string }[]
	tokenUri: {
		raw: string
	}
}
type SolNFT = {
	name: string
	description: string
	imageUrl: string
	tokenAddress: string
}
export type ResDataType = {
	eth: EthNFT[]
	sol: SolNFT[]
}

const handler = async (
	_req: NextApiRequest,
	res: NextApiResponse<ResDataType>
) => {
	// Fetch ETH NFTs
	const ethResponse = await fetch(
		`${process.env.ALCHEMY_API_PATH}/getNFTs?owner=0x8FE6fE9EC2a34D9e77Cdfeb5B2eaab5DfD8C2542`,
		{
			method: 'GET',
			headers: { 'content-type': 'application/json' },
		}
	)
	const ethData = await ethResponse.json()
	// Only return NFTs with media content
	ethData['ownedNfts'] = ethData['ownedNfts'].filter(
		(nft: EthNFT) => nft.media[0].raw !== ''
	)

	// Fetch SOL NFTs
	const solResponse = await fetch(process.env.QUICK_NODE_API_PATH, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			id: 67,
			jsonrpc: '2.0',
			method: 'qn_fetchNFTs',
			params: {
				wallet: 'HCc9D96ZLZvkRpnQyETVGijTKMeJy5xWpzt2KS75dHXS',
				omitFields: ['provenance', 'traits'],
				page: 1,
				perPage: 40,
			},
		}),
	})
	const solData = await solResponse.json()

	res.setHeader(
		'Cache-Control',
		'public, s-maxage=1200, stale-while-revalidate=600'
	)
	return res.status(200).json({
		eth: ethData['ownedNfts'],
		sol: solData['result']['assets'],
	})
}

export default withSentry(handler)
