# Drive Lens

This project is a social web app built on top of [Lens Protocol](https://lens.xyz/). The social app is built with car drivers in focus, but not limited to them. Currently, the app is only available on the Polygon Mumbai Testnet. 

Know more at [Google Slide](https://docs.google.com/presentation/d/1-XLi00yRRukucXnjGycnEFz9wz5t9pec8asGfgjWpWE/edit?usp=sharing).

Try [_here_](https://drive-lens.vercel.app/).

## What can users do with Drive Lens?

- 🔐 Authenticate with Lens
- 💰 Enable gasless and signless transaction by enabling [Lens' Profile Manager](https://docs.lens.xyz/docs/lens-profile-manager)
- 📝 Create publications and share their driving journey
- ❤️ Interact with other users' publications
- 🏆 Earn digital collectibles (NFTs) by completing missions
- 📊 View dashboard with data about their driving journey

### To-do
- [ ] Optmize authentication flow
- [ ] Add more missions
- [ ] Speed up loading time when creating a publication or comment

## What technologies are used?

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lens Protocol](https://lens.xyz/)
- [thirdweb](https://thirdweb.com/)
- [shadcn](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)

## Smart Contract
[ERC1155 - NFT](https://mumbai.polygonscan.com/address/0x00bF29a0A0E7f49fE927a6f99913Af16fb8FD038)
- combines the functionality of previous standards like ERC-20 (for fungible tokens) and ERC-721 (for non-fungible tokens)

## How to run locally?

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in the values
3. Install dependencies with `bun install`
4. Run the app with `bun run dev`
