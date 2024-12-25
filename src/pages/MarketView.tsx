// src/pages/MarketView.tsx

import React, { useState } from "react";
import { Typography, Card, Row, Col, Tag, Button, Modal, message } from "antd";
import { buyNFT } from "../utils/blockchain"; // Utility function for purchasing NFTs
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Title } = Typography;
const { Meta } = Card;

// Define colors and labels for rarity
const rarityColors: { [key: number]: string } = {
  1: "green",
  2: "blue",
  3: "purple",
  4: "orange",
};

const rarityLabels: { [key: number]: string } = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Epic",
};

// Define NFT type
type NFT = {
  id: number;
  owner: string;
  name: string;
  description: string;
  uri: string;
  price: number;
  for_sale: boolean;
  rarity: number;
};

// Truncate address helper function
const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const MarketView: React.FC = () => {
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const { connected, account } = useWallet();

  // Mock NFTs for display
  const mockNfts: NFT[] = [
    {
      id: 1,
      owner: "0x123...abc",
      name: "NFT 1",
      description: "An awesome NFT",
      uri: "https://fastly.picsum.photos/id/802/200/200.jpg?hmac=alfo3M8Ps4XWmFJGIwuzLUqOrwxqkE5_f65vCtk6_Iw",
      price: 1.5,
      for_sale: true,
      rarity: 1,
    },
    {
      id: 2,
      owner: "0x456...def",
      name: "NFT 2",
      description: "Another great NFT",
      uri: "https://fastly.picsum.photos/id/186/200/200.jpg?hmac=bNtKzMZT8HFzZq8mbTSWaQvmkX8T7TE47fspKMfxVl8",
      price: 2.0,
      for_sale: true,
      rarity: 2,
    },
    // Additional NFTs can be added here
  ];

  const handleBuyClick = (nft: NFT) => {
    if (!connected) {
      message.error("Please connect your wallet to purchase this NFT.");
      return;
    }
    setSelectedNft(nft);
    setIsBuyModalVisible(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedNft || !account?.address) {
      message.error("NFT purchase failed. Please try again.");
      return;
    }

    try {
      await buyNFT(account.address, selectedNft.id, selectedNft.price);
      message.success("NFT purchased successfully!");
      setIsBuyModalVisible(false);
      setSelectedNft(null);
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      message.error("Failed to purchase NFT. Please try again.");
    }
  };

  const handleCancelBuy = () => {
    setIsBuyModalVisible(false);
    setSelectedNft(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Title level={2} style={{ marginBottom: "20px" }}>
        NFT Marketplace
      </Title>
      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        {mockNfts.map((nft) => (
          <Col
            key={nft.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              hoverable
              style={{ width: "100%", maxWidth: "240px" }}
              cover={<img alt={nft.name} src={nft.uri} />}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleBuyClick(nft)}
                  disabled={!nft.for_sale}
                >
                  {nft.for_sale ? "Buy" : "Not for Sale"}
                </Button>,
              ]}
            >
              <Tag
                color={rarityColors[nft.rarity]}
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {rarityLabels[nft.rarity]}
              </Tag>
              <Meta title={nft.name} description={`Price: ${nft.price} APT`} />
              <p>{nft.description}</p>
              <p>ID: {nft.id}</p>
              <p>Owner: {truncateAddress(nft.owner)}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Purchase NFT"
        visible={isBuyModalVisible}
        onCancel={handleCancelBuy}
        footer={[
          <Button key="cancel" onClick={handleCancelBuy}>
            Cancel
          </Button>,
          <Button
            key="buy"
            type="primary"
            onClick={handleConfirmPurchase}
          >
            Confirm Purchase
          </Button>,
        ]}
      >
        {selectedNft && (
          <>
            <p>
              <strong>Name:</strong> {selectedNft.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedNft.description}
            </p>
            <p>
              <strong>Price:</strong> {selectedNft.price} APT
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MarketView;