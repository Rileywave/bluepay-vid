import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  withdrawal_amount: number;
  amount: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  payment_screenshot: string | null;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error || !data) {
        toast({
          variant: "destructive",
          description: "Access denied. Admin privileges required.",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchWithdrawals();
    } catch (error) {
      navigate('/');
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch withdrawal requests",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, userId: string, withdrawalAmount: number) => {
    try {
      const { error: updateError } = await supabase
        .from('withdrawal_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (updateError) throw updateError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_earnings')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const newEarnings = Math.max(0, (profile.referral_earnings || 0) - withdrawalAmount);

      const { error: earningsError } = await supabase
        .from('profiles')
        .update({ referral_earnings: newEarnings })
        .eq('id', userId);

      if (earningsError) throw earningsError;

      toast({
        description: "Withdrawal approved successfully",
      });

      fetchWithdrawals();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to approve withdrawal",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        description: "Withdrawal rejected",
      });

      fetchWithdrawals();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to reject withdrawal",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Withdrawal Management</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Bank Details</TableHead>
                  <TableHead>Withdrawal Amount</TableHead>
                  <TableHead>Fee Paid</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No withdrawal requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{withdrawal.profiles?.full_name}</p>
                          <p className="text-sm text-muted-foreground">{withdrawal.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{withdrawal.bank_name}</p>
                          <p>{withdrawal.account_name}</p>
                          <p className="text-muted-foreground">{withdrawal.account_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">
                          ₦{withdrawal.withdrawal_amount?.toLocaleString() || 0}
                        </span>
                      </TableCell>
                      <TableCell>₦{withdrawal.amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        {withdrawal.payment_screenshot ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedImage(withdrawal.payment_screenshot)}
                          >
                            <Eye size={16} />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No proof</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : withdrawal.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {withdrawal.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(withdrawal.id, withdrawal.user_id, withdrawal.withdrawal_amount)}
                            >
                              <CheckCircle size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(withdrawal.id)}
                            >
                              <XCircle size={16} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>Screenshot of payment submitted by user</DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Payment proof"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
