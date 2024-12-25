import React, { useState } from "react";
import { Typography, Card, Row, Col, Pagination, Button, Input, Modal, Tag } from "antd";

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
  4: "Super Rare",
};

// Define NFT type
type NFT = {
  id: number;
  name: string;
  description: string;
  uri: string;
  rarity: number;
  price: number;
  for_sale: boolean;
};

const MyNFTs: React.FC = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [salePrice, setSalePrice] = useState<string>("");

  // Mock NFTs for display
  const mockNFTs: NFT[] = [
    { id: 1, name: "NFT 9", description: "My awesome NFT", uri: "https://fastly.picsum.photos/id/13/150/150.jpg?hmac=9Hs7x8EWUkoSin2iGPvg3BzaSRVCIsWBfJr9S9NL-3Q", rarity: 1, price: 1.5, for_sale: false },
    { id: 2, name: "NFT 10", description: "My awesome NFT", uri: "https://fastly.picsum.photos/id/338/200/200.jpg?hmac=5S5SeR5xW8mbN3Ml7wTTJPePX392JafhcFMGm7IFNy0", rarity: 2, price: 2.0, for_sale: false },
    { id: 3, name: "NFT 11", description: "My awesome NFT", uri: "https://fastly.picsum.photos/id/572/200/200.jpg?hmac=YFsNUCQc2Dfz_5O0HY8HmDfquz04XrdcpJ0P4Z7plRY", rarity: 3, price: 2.5, for_sale: false },
  ];

  // Handle sell button click
  const handleSellClick = (nft: NFT) => {
    setSelectedNFT(nft);
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedNFT(null);
    setSalePrice("");
  };

  // Handle sale price input change
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalePrice(e.target.value);
  };

  // Handle NFT sale confirmation
  const handleSellConfirm = () => {
    if (selectedNFT && salePrice) {
      console.log(`Putting NFT (ID: ${selectedNFT.id}) for sale at ${salePrice} APT`);
      // Logic for updating NFT sale status can go here
      handleCancel();
    }
  };

  // Paginate displayed NFTs
  const paginatedNFTs = mockNFTs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Title level={2} style={{ marginBottom: "20px" }}>My NFT Collection</Title>
      <Row gutter={[24, 24]} style={{ marginTop: 20, marginBottom: 40, width: "100%", maxWidth: "100%" }}>
        {paginatedNFTs.map((nft) => (
          <Col
            key={nft.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              hoverable
              style={{ width: "100%", maxWidth: "240px", margin: "0 auto" }}
              cover={<img alt={nft.name} src={nft.uri} />}
              actions={[
                <Button type="link" onClick={() => handleSellClick(nft)}>
                  Sell
                </Button>,
              ]}
            >
              <Tag
                color={rarityColors[nft.rarity]}
                style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}
              >
                {rarityLabels[nft.rarity]}
              </Tag>
              <Meta title={nft.name} description={`Price: ${nft.price} APT`} />
              <p>{nft.description}</p>
              <p>ID: {nft.id}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={mockNFTs.length}
        onChange={setCurrentPage}
        style={{ marginTop: "20px" }}
      />

      <Modal
        title="Sell NFT"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSellConfirm}
        okText="Confirm Sale"
        okButtonProps={{ disabled: !salePrice }}
      >
        {selectedNFT && (
          <>
            <p><strong>Name:</strong> {selectedNFT.name}</p>
            <p><strong>Rarity:</strong> {rarityLabels[selectedNFT.rarity]}</p>
            <p><strong>Description:</strong> {selectedNFT.description}</p>
          </>
        )}
        <Input
          placeholder="Enter sale price in APT"
          value={salePrice}
          onChange={handleSalePriceChange}
          style={{ marginTop: "20px" }}
        />
      </Modal>
    </div>
  );
};

export default MyNFTs;