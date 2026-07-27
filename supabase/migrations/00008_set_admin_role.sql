-- Ensure admin@prosecurity.az has admin role in profiles
INSERT INTO profiles (id, email, full_name, role)
VALUES ('78622ed5-fb1f-43e9-93b8-fd262b362de8', 'admin@prosecurity.az', 'Administrator', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Also ensure bymovlud@gmail.com has admin role
INSERT INTO profiles (id, email, full_name, role)
VALUES ('a21a16de-c824-448a-bcb4-b6749b37024e', 'bymovlud@gmail.com', 'Administrator', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';