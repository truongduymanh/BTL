import { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
} from "antd";

const { TabPane } = Tabs;

export default function Bai2() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  const [blockModal, setBlockModal] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);
  const [questionModal, setQuestionModal] = useState(false);

  const [form] = Form.useForm();
  const [subjectForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [examForm] = Form.useForm();

  useEffect(() => {
    const b = localStorage.getItem("blocks");
    const s = localStorage.getItem("subjects");
    const q = localStorage.getItem("questions");

    if (b) setBlocks(JSON.parse(b));
    if (s) setSubjects(JSON.parse(s));
    if (q) setQuestions(JSON.parse(q));
  }, []);

  useEffect(() => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [blocks, subjects, questions]);


  const addBlock = async () => {
    const v = await form.validateFields();

    setBlocks([...blocks, { id: Date.now(), name: v.name }]);

    setBlockModal(false);
    form.resetFields();
  };


  const addSubject = async () => {
    const v = await subjectForm.validateFields();

    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        code: v.code,
        name: v.name,
        credit: v.credit,
      },
    ]);

    setSubjectModal(false);
    subjectForm.resetFields();
  };


  const addQuestion = async () => {
    const v = await questionForm.validateFields();

    setQuestions([
      ...questions,
      {
        id: Date.now(),
        subjectId: v.subjectId,
        blockId: v.blockId,
        content: v.content,
        level: v.level,
      },
    ]);

    setQuestionModal(false);
    questionForm.resetFields();
  };


  const createExam = async () => {
    const v = await examForm.validateFields();

    const filtered = questions.filter(
      (q: any) => q.subjectId === v.subjectId && q.level === v.level
    );

    if (filtered.length < v.quantity) {
      message.error("Không đủ câu hỏi");
      return;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, v.quantity);

    setExams([
      ...exams,
      {
        id: Date.now(),
        subjectId: v.subjectId,
        questions: selected,
      },
    ]);

    message.success("Tạo đề thành công");
  };


  const blockColumns = [
    {
      title: "Tên khối",
      dataIndex: "name",
    },
  ];

  const subjectColumns = [
    { title: "Mã môn", dataIndex: "code" },
    { title: "Tên môn", dataIndex: "name" },
    { title: "Tín chỉ", dataIndex: "credit" },
  ];

  const questionColumns = [
    {
      title: "Môn học",
      render: (_: any, r: any) =>
        subjects.find((s: any) => s.id === r.subjectId)?.name,
    },
    {
      title: "Khối",
      render: (_: any, r: any) =>
        blocks.find((b: any) => b.id === r.blockId)?.name,
    },
    { title: "Nội dung", dataIndex: "content" },
    { title: "Mức độ", dataIndex: "level" },
  ];

  return (
    <Card title="Quản lý ngân hàng câu hỏi">

      <Tabs>

        <TabPane tab="Khối kiến thức" key="1">

          <Button type="primary" onClick={() => setBlockModal(true)}>
            Thêm khối
          </Button>

          <Table
            style={{ marginTop: 20 }}
            columns={blockColumns}
            dataSource={blocks}
            rowKey="id"
          />

        </TabPane>

        <TabPane tab="Môn học" key="2">

          <Button type="primary" onClick={() => setSubjectModal(true)}>
            Thêm môn
          </Button>

          <Table
            style={{ marginTop: 20 }}
            columns={subjectColumns}
            dataSource={subjects}
            rowKey="id"
          />

        </TabPane>

        <TabPane tab="Câu hỏi" key="3">

          <Button type="primary" onClick={() => setQuestionModal(true)}>
            Thêm câu hỏi
          </Button>

          <Table
            style={{ marginTop: 20 }}
            columns={questionColumns}
            dataSource={questions}
            rowKey="id"
          />

        </TabPane>

        <TabPane tab="Tạo đề thi" key="4">

          <Form form={examForm} layout="vertical">

            <Form.Item
              name="subjectId"
              label="Môn học"
              rules={[{ required: true }]}
            >
              <Select>
                {subjects.map((s: any) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="level"
              label="Mức độ"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Dễ">Dễ</Select.Option>
                <Select.Option value="Trung bình">Trung bình</Select.Option>
                <Select.Option value="Khó">Khó</Select.Option>
                <Select.Option value="Rất khó">Rất khó</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số câu"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Button type="primary" onClick={createExam}>
              Tạo đề
            </Button>

          </Form>

        </TabPane>

      </Tabs>

      {}

      <Modal
        title="Thêm khối kiến thức"
        visible={blockModal}
        onOk={addBlock}
        onCancel={() => setBlockModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên khối" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {}

      <Modal
        title="Thêm môn học"
        visible={subjectModal}
        onOk={addSubject}
        onCancel={() => setSubjectModal(false)}
      >
        <Form form={subjectForm} layout="vertical">

          <Form.Item name="code" label="Mã môn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Tên môn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="credit" label="Tín chỉ" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

        </Form>
      </Modal>

      {}

      <Modal
        title="Thêm câu hỏi"
        visible={questionModal}
        onOk={addQuestion}
        onCancel={() => setQuestionModal(false)}
      >
        <Form form={questionForm} layout="vertical">

          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
            <Select>
              {subjects.map((s: any) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="blockId" label="Khối kiến thức" rules={[{ required: true }]}>
            <Select>
              {blocks.map((b: any) => (
                <Select.Option key={b.id} value={b.id}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="level" label="Mức độ">
            <Select>
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
              <Select.Option value="Rất khó">Rất khó</Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>

    </Card>
  );
}
