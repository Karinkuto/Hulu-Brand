import React from "react";
import { useAuthStore } from "../../stores/authStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Container } from "@mui/material";

export default function UsersPage() {
  const { users, isAdmin, promoteUser, demoteUser, removeUser } = useAuthStore();

  if (!isAdmin) {
    return <div>You do not have permission to view this page.</div>;
  }

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) {
      return { date: "N/A", time: "" };
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return { date: "Invalid Date", time: "" };
      }
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
      };
    } catch (error) {
      return { date: "Invalid Date", time: "" };
    }
  };

  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9 && cleaned.startsWith('9')) {
      return `0${cleaned}`;
    }
    if (cleaned.length === 10 && cleaned.startsWith('09')) {
      return cleaned;
    }
    return phone; // Return original if not in expected format
  };

  return (
    <Container maxWidth="lg">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                {/* Removed Email column */}
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{formatPhoneNumber(user.phone)}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div>{formatDate(user.createdAt).date}</div>
                    <div className="text-sm text-gray-500">{formatDate(user.createdAt).time}</div>
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(user.lastLogin).date}</div>
                    <div className="text-sm text-gray-500">{formatDate(user.lastLogin).time}</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.role !== 'admin' && (
                          <DropdownMenuItem onClick={() => promoteUser(user.id)}>
                            Promote to Admin
                          </DropdownMenuItem>
                        )}
                        {user.role === 'admin' && (
                          <DropdownMenuItem onClick={() => demoteUser(user.id)}>
                            Demote to User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => removeUser(user.id)} className="text-red-600">
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}