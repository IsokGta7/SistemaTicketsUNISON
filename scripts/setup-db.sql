-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Ticket table
CREATE TABLE IF NOT EXISTS "Ticket" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    category TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "creatorId" UUID NOT NULL REFERENCES "User"(id),
    "assigneeId" UUID REFERENCES "User"(id)
);

-- Create Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "ticketId" UUID NOT NULL REFERENCES "Ticket"(id),
    "userId" UUID NOT NULL REFERENCES "User"(id)
);

-- Create TicketHistory table
CREATE TABLE IF NOT EXISTS "TicketHistory" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "ticketId" UUID NOT NULL REFERENCES "Ticket"(id),
    "userId" UUID NOT NULL REFERENCES "User"(id)
);

-- Create Attachment table
CREATE TABLE IF NOT EXISTS "Attachment" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    size INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "ticketId" UUID NOT NULL REFERENCES "Ticket"(id)
);

-- Create Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL REFERENCES "User"(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ticket_creator ON "Ticket"("creatorId");
CREATE INDEX IF NOT EXISTS idx_ticket_assignee ON "Ticket"("assigneeId");
CREATE INDEX IF NOT EXISTS idx_comment_ticket ON "Comment"("ticketId");
CREATE INDEX IF NOT EXISTS idx_comment_user ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS idx_tickethistory_ticket ON "TicketHistory"("ticketId");
CREATE INDEX IF NOT EXISTS idx_tickethistory_user ON "TicketHistory"("userId");
CREATE INDEX IF NOT EXISTS idx_attachment_ticket ON "Attachment"("ticketId");
CREATE INDEX IF NOT EXISTS idx_notification_user ON "Notification"("userId"); 