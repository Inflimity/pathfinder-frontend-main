-- Run this script in the Supabase SQL Editor to create the tables

-- 1. Create Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    conversation_id UUID REFERENCES conversations (id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN ('user', 'oracle', 'system')
    ),
    content TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for Conversations
CREATE POLICY "Users can view their own conversations" ON conversations FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert their own conversations" ON conversations FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete their own conversations" ON conversations FOR DELETE USING (auth.uid () = user_id);

-- Policies for Messages
CREATE POLICY "Users can view messages from their conversations" ON messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM conversations
            WHERE
                conversations.id = messages.conversation_id
                AND conversations.user_id = auth.uid ()
        )
    );

CREATE POLICY "Users can insert messages to their conversations" ON messages FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM conversations
            WHERE
                conversations.id = messages.conversation_id
                AND conversations.user_id = auth.uid ()
        )
    );