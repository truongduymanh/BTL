import React, { useState } from 'react';
import { Card, InputNumber, Button, Table, Typography, message } from 'antd';

const { Title } = Typography;

export default function Bai1() {
  const [randomNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const maxAttempts = 10;

  const handleGuess = () => {
    if (guess === null) {
      message.warning('Vui lòng nhập số!');
      return;
    }

    if (gameOver) return;

    const newAttempts = attempts + 1;
    let result = '';

    if (guess === randomNumber) {
      result = '🎉 Đoán đúng!';
      message.success('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
    } else if (guess < randomNumber) {
      result = '⬇ Quá thấp';
      message.info('Bạn đoán quá thấp!');
    } else {
      result = '⬆ Quá cao';
      message.info('Bạn đoán quá cao!');
    }

    if (newAttempts === maxAttempts && guess !== randomNumber) {
      message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}`);
      setGameOver(true);
    }

    setAttempts(newAttempts);
    setHistory([
      ...history,
      {
        key: newAttempts,
        lan: newAttempts,
        soDoan: guess,
        ketQua: result,
      },
    ]);

    setGuess(null);
  };

  const columns = [
    { title: 'Lần đoán', dataIndex: 'lan' },
    { title: 'Số bạn đoán', dataIndex: 'soDoan' },
    { title: 'Kết quả', dataIndex: 'ketQua' },
  ];

  return (
    <Card>
      <Title level={3}>TH01 - Bài 1: Game Đoán Số (1-100)</Title>

      <div style={{ marginBottom: 20 }}>
        <InputNumber
          min={1}
          max={100}
          value={guess}
          onChange={setGuess}
          disabled={gameOver}
        />

        <Button
          type="primary"
          danger
          onClick={handleGuess}
          style={{ marginLeft: 10 }}
          disabled={gameOver}
        >
          Đoán
        </Button>
      </div>

      <p>Lượt chơi: {attempts} / {maxAttempts}</p>

      <Table
        columns={columns}
        dataSource={history}
        pagination={false}
      />
    </Card>
  );
}