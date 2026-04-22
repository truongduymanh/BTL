import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, Row, Col, Tag, Input, Pagination, 
  Form, Button, Table, Select, Popconfirm, 
  message, Divider, Avatar 
} from 'antd';
import { 
  UserOutlined, GlobalOutlined, GithubOutlined, 
  SearchOutlined, EyeOutlined, CalendarOutlined 
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Search } = Input;

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  author: string;
}

export default function BlogDuyManh() {
  const AUTHOR_NAME = "Trương Duy Mạnh"; // Fix tên đầy đủ ở đây
  const PLACEHOLDER_IMG = "https://via.placeholder.com/400x250?text=No+Image"; // Ảnh placeholder mặc định khi lỗi

  // --- STATE DỮ LIỆU ---
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Học ReactJS cùng Trương Duy Mạnh', // Fix tên bài
      slug: 'hoc-react-co-ban',
      summary: 'Hướng dẫn lộ trình học React hiệu quả cho người mới...',
      content: '# Chào mừng bạn! \n\n Đây là nội dung Markdown bài viết của Mạnh.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', // Fix URL ảnh Unsplash chắc chắn hiện
      tags: ['react', 'js'],
      status: 'published',
      views: 11,
      createdAt: '22/04/2026',
      author: AUTHOR_NAME // Fix tác giả
    }
  ]);

  const [tags, setTags] = useState(['react', 'js', 'html', 'css']);
  const [tab, setTab] = useState('home'); // home | manage | about | tag-manage
  const [search, setSearch] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // --- STATE MODAL TỰ CHẾ (FIX LỖI CHẶN LAYER TRÊN MÁY BẠN) ---
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  // Debounce tìm kiếm 300ms
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Logic Lọc & Tìm kiếm
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(debounceSearch.toLowerCase());
      const matchTag = filterTag ? p.tags.includes(filterTag) : true;
      return matchSearch && matchTag && p.status === 'published';
    });
  }, [posts, debounceSearch, filterTag]);

  const [searchDebounce, setSearchDebounce] = useState('');

  // Lưu bài viết
  const handleSave = (values: any) => {
    const data: Post = {
      ...values,
      id: editingPost ? editingPost.id : Date.now().toString(),
      views: editingPost ? editingPost.views : 0,
      createdAt: editingPost ? editingPost.createdAt : '22/04/2026',
      author: AUTHOR_NAME,
      thumbnail: values.thumbnail || PLACEHOLDER_IMG
    };
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? data : p));
      message.success('Cập nhật thành công!');
    } else {
      setPosts([data, ...posts]);
      message.success('Đã đăng bài mới!');
    }
    setShowForm(false);
    setEditingPost(null);
    form.resetFields();
  };

  // --- STYLE CHO MODAL TỰ CHẾ (FIX LỖI LAYER) ---
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000,
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
  };

  const modalStyle: React.CSSProperties = {
    background: '#fff', padding: '25px', borderRadius: '12px',
    width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto'
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      
      {/* MENU ĐIỀU HƯỚNG */}
      <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
        <Button type={tab === 'home' ? 'primary' : 'text'} onClick={() => setTab('home')}>Trang chủ</Button>
        <Button type={tab === 'manage' ? 'primary' : 'text'} onClick={() => setTab('manage')} style={{margin: '0 15px'}}>Quản lý</Button>
        <Button type={tab === 'tag-manage' ? 'primary' : 'text'} onClick={() => setTab('tag-manage')} style={{marginRight: '15px'}}>Quản lý Thẻ</Button>
        <Button type={tab === 'about' ? 'primary' : 'text'} onClick={() => setTab('about')}>Giới thiệu</Button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* 1. TRANG CHỦ */}
        {tab === 'home' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h1>Blog của {AUTHOR_NAME}</h1>
              <Search placeholder="Tìm bài viết..." size="large" onChange={e => setSearch(e.target.value)} style={{maxWidth: 500, marginBottom: 15}} enterButton />
              <div>
                <Tag color={!filterTag ? 'blue' : ''} onClick={() => setFilterTag(null)} style={{cursor: 'pointer'}}>Tất cả</Tag>
                {tags.map(t => <Tag key={t} color={filterTag === t ? 'blue' : ''} onClick={() => setFilterTag(t)} style={{cursor: 'pointer'}}>{t}</Tag>)}
              </div>
            </div>
            <Row gutter={[20, 20]}>
              {filteredPosts.slice((page - 1) * 9, page * 9).map(p => (
                <Col span={8} key={p.id}>
                  <Card 
                    hoverable 
                    // FIX: Thêm onError để load ảnh placeholder khi link ảnh gốc lỗi
                    cover={
                        <img 
                            src={p.thumbnail} 
                            style={{height: 200, objectFit: 'cover'}} 
                            alt={p.title}
                            onError={(e) => {
                                e.currentTarget.onerror = null; // Ngăn lặp vô hạn
                                e.currentTarget.src = PLACEHOLDER_IMG;
                            }}
                        />
                    }
                    onClick={() => {
                      setPosts(posts.map(x => x.id === p.id ? {...x, views: x.views + 1} : x));
                      setShowDetail(p);
                    }}
                  >
                    <Card.Meta title={p.title} description={p.summary} />
                    <div style={{marginTop: 12, fontSize: 12, color: '#888'}}>
                      <CalendarOutlined /> {p.createdAt} • <EyeOutlined /> {p.views}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination align="center" current={page} total={filteredPosts.length} pageSize={9} onChange={setPage} style={{marginTop: 30}} />
          </div>
        )}

        {/* 2. QUẢN LÝ BÀI VIẾT */}
        {tab === 'manage' && (
          <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
            <Button type="primary" danger onClick={() => { setEditingPost(null); form.resetFields(); setShowForm(true); }} style={{marginBottom: 20}}>
              + Viết bài mới
            </Button>
            <Table
              dataSource={posts}
              rowKey="id"
              columns={[
                { title: 'Tiêu đề', dataIndex: 'title' },
                { title: 'Views', dataIndex: 'views' },
                { title: 'Trạng thái', dataIndex: 'status', render: (s) => <Tag color={s === 'published' ? 'green' : 'gold'}>{s}</Tag> },
                { title: 'Thao tác', render: (_, r) => (
                  <>
                    <Button type="link" onClick={() => { setEditingPost(r); form.setFieldsValue(r); setShowForm(true); }}>Sửa</Button>
                    <Popconfirm title="Xóa bài?" onConfirm={() => setPosts(posts.filter(x => x.id !== r.id))}><Button type="link" danger>Xóa</Button></Popconfirm>
                  </>
                )}
              ]}
            />
          </div>
        )}

        {/* 3. QUẢN LÝ THẺ */}
        {tab === 'tag-manage' && (
          <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
             <h3>Quản lý thẻ (Tags)</h3>
             <Table 
              dataSource={tags.map(t => ({ name: t, count: posts.filter(p => p.tags.includes(t)).length }))}
              rowKey="name"
              columns={[
                { title: 'Tên thẻ', dataIndex: 'name' },
                { title: 'Số bài sử dụng', dataIndex: 'count' },
                { title: 'Thao tác', render: (_, r) => <Button type="link" danger onClick={() => setTags(tags.filter(x => x !== r.name))}>Xóa thẻ</Button> }
              ]}
             />
          </div>
        )}

        {/* 4. GIỚI THIỆU */}
        {tab === 'about' && (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Card style={{ maxWidth: 500, margin: '0 auto', borderRadius: 15 }}>
              <Avatar size={100} icon={<UserOutlined />} />
              <h2 style={{ marginTop: 20 }}>{AUTHOR_NAME}</h2>
              <p>Fullstack Developer | Kỹ năng: React, Node.js, TypeScript</p>
              <Divider />
              <GithubOutlined style={{ fontSize: 30, margin: '0 20px' }} />
              <GlobalOutlined style={{ fontSize: 30 }} />
            </Card>
          </div>
        )}
      </div>

      {/* --- CUSTOM MODAL: FORM VIẾT BÀI --- */}
      {showForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{marginBottom: 20}}>{editingPost ? "Cập nhật bài viết" : "Viết bài mới"}</h2>
            <Form form={form} onFinish={handleSave} layout="vertical">
              <Row gutter={16}>
                <Col span={12}><Form.Item name="title" label="Tiêu đề" rules={[{required: true}]}><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="slug" label="Slug"><Input /></Form.Item></Col>
              </Row>
              <Form.Item name="thumbnail" label="URL Ảnh đại diện"><Input placeholder="https://..." /></Form.Item>
              <Form.Item name="summary" label="Tóm tắt ngắn"><Input /></Form.Item>
              <Form.Item name="content" label="Nội dung (Markdown)"><Input.TextArea rows={6} /></Form.Item>
              <Row gutter={16}>
                <Col span={12}><Form.Item name="tags" label="Gắn thẻ"><Select mode="tags" /></Form.Item></Col>
                <Col span={12}>
                  <Form.Item name="status" label="Trạng thái" initialValue="published">
                    <Select><Select.Option value="published">Đăng ngay</Select.Option><Select.Option value="draft">Bản nháp</Select.Option></Select>
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ textAlign: 'right', marginTop: 20 }}>
                <Button onClick={() => setShowForm(false)} style={{marginRight: 10}}>Hủy bỏ</Button>
                <Button type="primary" onClick={() => form.submit()}>Lưu bài viết</Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* --- CUSTOM MODAL: CHI TIẾT BÀI VIẾT --- */}
      {showDetail && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <img 
              src={showDetail.thumbnail} 
              style={{width: '100%', borderRadius: 8, maxHeight: 300, objectFit: 'cover'}} 
              alt={showDetail.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER_IMG;
              }}
            />
            <h1 style={{marginTop: 20}}>{showDetail.title}</h1>
            <p>Tác giả: <b>{showDetail.author}</b> | Ngày: {showDetail.createdAt} | Lượt xem: {showDetail.views}</p>
            <Divider />
            <div style={{minHeight: 200}}><ReactMarkdown>{showDetail.content}</ReactMarkdown></div>
            <Divider />
            <h3>Bài viết liên quan:</h3>
            <Row gutter={10}>
              {posts.filter(x => x.id !== showDetail.id && x.tags.some(t => showDetail.tags.includes(t))).slice(0, 2).map(r => (
                <Col span={12} key={r.id}>
                  <Card size="small" hoverable onClick={() => setShowDetail(r)}>{r.title}</Card>
                </Col>
              ))}
            </Row>
            <div style={{textAlign: 'right', marginTop: 30}}>
              <Button size="large" onClick={() => setShowDetail(null)}>Quay lại danh sách</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}