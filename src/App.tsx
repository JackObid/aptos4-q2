// src/App.tsx

import React, { useState } from "react";
import "./App.css";
import { Layout, Modal, Form, Input, Select, Button, message } from "antd";
import NavBar from "./components/NavBar";
import MarketView from "./pages/MarketView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNFTs from "./pages/MyNFTs";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { mintNFT } from "./utils/blockchain"; // Custom function for minting NFTs

const { Content } = Layout;

const App: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { connected, account } = useWallet(); // Wallet integration

  // Function to open the Mint NFT modal
  const handleMintNFTClick = () => {
    if (!connected) {
      message.error("Please connect your wallet before minting an NFT.");
      return;
    }
    setIsModalVisible(true);
  };

  // Function to handle NFT minting
  const handleMintSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { name, description, uri, rarity } = values;

      // Call the blockchain mint function
      await mintNFT(account?.address, name, description, uri, rarity);
      message.success("NFT minted successfully!");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Minting failed:", error);
      message.error("Failed to mint NFT. Please try again.");
    }
  };

  return (
    <Router>
      <Layout>
        <NavBar onMintNFTClick={handleMintNFTClick} /> {/* Pass handleMintNFTClick to NavBar */}
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<MarketView />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
          </Routes>
        </Content>

        {/* Mint NFT Modal */}
        <Modal
          title="Mint New NFT"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter a name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter a description!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="URI"
              name="uri"
              rules={[{ required: true, message: "Please enter a URI!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Rarity"
              name="rarity"
              rules={[{ required: true, message: "Please select a rarity!" }]}
            >
              <Select>
                <Select.Option value="Common">Common</Select.Option>
                <Select.Option value="Uncommon">Uncommon</Select.Option>
                <Select.Option value="Rare">Rare</Select.Option>
                <Select.Option value="Epic">Epic</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleMintSubmit}>
                Mint NFT
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Router>
  );
};

export default App;