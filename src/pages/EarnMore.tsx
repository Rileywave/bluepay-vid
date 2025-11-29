import React, { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Users, Copy, Share2, CheckCircle, Wallet, ArrowUpCircle, Loader2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const EarnMore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [referralRate, setReferralRate] = useState<number>(15000);
  const [accountUpgraded, setAccountUpgraded] = useState(false);
  const [taxJoinCompletedAt, setTaxJoinCompletedAt] = useState<string | null>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchUserReferralData();
    fetchWithdrawalHistory();
  }, []);

  const fetchUserReferralData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Error",
          description: "Please log in to view your referral data",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referral_earnings, referral_rate, account_upgraded, tax_join_completed_at')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      if (data) {
        setReferralCode(data.referral_code || '');
        setReferralCount(data.referral_count || 0);
        setReferralEarnings(Number(data.referral_earnings) || 0);
        setReferralRate(Number(data.referral_rate) || 15000);
        setAccountUpgraded(data.account_upgraded || false);
        setTaxJoinCompletedAt(data.tax_join_completed_at);
      }
    } catch (error: any) {
      console.error('Fetch user data error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalHistory = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Withdrawal history fetch error:', error);
        return;
      }
      setWithdrawalHistory(data || []);
    } catch (error: any) {
      console.error('Withdrawal history error:', error);
      // Silent fail - not critical
    }
  };

  const generateReferralLink = () => {
    return `${window.location.origin}/register?ref=${referralCode}`;
  };

  const generateReferralMessage = () => {
    return `🎉 Join BluePay and earn money! 💰\n\nUse my referral code: ${referralCode}\n\nRegister here: ${generateReferralLink()}\n\n#BluePay #EarnMoney #Referral`;
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(generateReferralLink());
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const copyReferralMessage = () => {
    navigator.clipboard.writeText(generateReferralMessage());
    toast({
      title: "Message Copied!",
      description: "Full referral message copied to clipboard",
    });
  };

  const shareReferralLink = () => {
    const referralLink = generateReferralLink();
    const referralMessage = generateReferralMessage();
    
    if (navigator.share) {
      navigator.share({
        title: 'Join BluePay and Earn!',
        text: referralMessage,
        url: referralLink,
      });
    } else {
      copyReferralMessage();
    }
  };

  const handleWithdraw = () => {
    if (referralEarnings < 100000) {
      toast({
        variant: "destructive",
        description: "Minimum withdrawal amount is ₦100,000",
      });
      return;
    }

    navigate('/withdrawal/form');
  };

  const handleWithdrawSuccess = () => {
    fetchUserReferralData();
    fetchWithdrawalHistory();
  };

  const handleTaxJoinGroup = async () => {
    const whatsappLink = "https://chat.whatsapp.com/JNuHAVaGNgQD40cQXOwFwV";
    const telegramLink = "https://t.me/+wYh9iSrC3YkyMTlk";
    
    window.open(whatsappLink, '_blank');
    window.open(telegramLink, '_blank');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newRate = referralRate + 10000;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          referral_rate: newRate,
          tax_join_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        description: "🎉 Bonus activated! Your referral rate increased by ₦10,000 for 24 hours!",
      });

      fetchUserReferralData();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to activate bonus. Please try again.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'awaiting_activation_payment': { label: 'Awaiting Payment', variant: 'secondary' },
      'under_review': { label: 'Under Review', variant: 'default' },
      'approved': { label: 'Approved', variant: 'default' },
      'paid': { label: 'Paid', variant: 'default' },
      'rejected': { label: 'Rejected', variant: 'destructive' },
    };
    
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-5">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3 text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Earn More</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{referralCount}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </Card>
          <Card className="p-4 text-center">
            <Wallet className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-foreground">₦{formatCurrency(referralEarnings)}</p>
            <p className="text-xs text-muted-foreground">Earnings</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-foreground">₦{formatCurrency(referralRate)}</p>
            <p className="text-xs text-muted-foreground">Per Referral</p>
          </Card>
        </div>

        {/* Quick Withdraw Button */}
        <Button 
          onClick={handleWithdraw}
          className="w-full"
          size="lg"
          disabled={referralEarnings < 100000}
        >
          <Wallet className="w-5 h-5 mr-2" />
          Withdraw Earnings
        </Button>
        {referralEarnings < 100000 && (
          <p className="text-xs text-muted-foreground text-center -mt-4">
            Need ₦{formatCurrency(100000 - referralEarnings)} more to withdraw (minimum: ₦100,000)
          </p>
        )}

        {/* Referral Details */}
        <Card className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Referral Program</h3>
              <p className="text-sm text-muted-foreground">Share and earn ₦{formatCurrency(referralRate)}/referral</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Your Referral Code</h4>
              <div className="flex items-center gap-2 p-3 bg-background rounded border">
                <span className="font-mono text-lg font-bold flex-1">{referralCode}</span>
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Your Referral Link</h4>
              <div className="flex items-center gap-2 p-3 bg-background rounded border">
                <span className="text-sm flex-1 break-all">{generateReferralLink()}</span>
                <Button size="sm" variant="outline" onClick={copyReferralLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={shareReferralLink}
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
              <Button 
                variant="outline"
                onClick={copyReferralMessage}
              >
                <Copy className="h-4 w-4" />
                Copy Message
              </Button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-sm">How it works:</h5>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Share your referral code or link with friends</li>
                    <li>• When they register, you earn ₦{formatCurrency(referralRate)}</li>
                    <li>• Track your earnings in real-time</li>
                    <li>• Withdraw when you reach ₦100,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Withdrawal History */}
        {withdrawalHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Recent Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">₦{formatCurrency(withdrawal.amount)}</span>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(withdrawal.created_at).toLocaleDateString('en-NG', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      {withdrawal.status === 'awaiting_activation_payment' && (
                        <p className="text-xs text-amber-600 mt-1">
                          Please pay the activation fee and upload your receipt.
                        </p>
                      )}
                      {withdrawal.status === 'under_review' && (
                        <p className="text-xs text-blue-600 mt-1">
                          Payment uploaded. We'll review shortly.
                        </p>
                      )}
                      {(withdrawal.status === 'approved' || withdrawal.status === 'paid') && (
                        <p className="text-xs text-green-600 mt-1">
                          {withdrawal.status === 'approved' ? 'Withdrawal approved. Payout queued.' : 'Withdrawal completed.'}
                        </p>
                      )}
                      {withdrawal.status === 'rejected' && (
                        <div className="mt-1">
                          <p className="text-xs text-destructive">
                            Withdrawal rejected: {withdrawal.notes || 'No reason provided'}. Contact support on Telegram.
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => window.open('https://t.me/+wYh9iSrC3YkyMTlk', '_blank')}
                          >
                            Contact Support
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tax/Join Group Bonus */}
        {!taxJoinCompletedAt && (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">
                  🎁 Boost Your Earnings!
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Join our community groups and get +₦10,000 bonus for 24 hours
                </p>
                <Button 
                  onClick={handleTaxJoinGroup}
                  className="w-full"
                  variant="default"
                >
                  Perform Tax / Join Group
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {taxJoinCompletedAt && (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">
                  ✨ Bonus Active! +₦10,000 for 24hrs
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Referral Rate Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5" />
              Upgrade Referral Rate
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Increase your earnings per referral by upgrading your rate
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { rate: 15000, label: "Default", current: referralRate === 15000 },
              { rate: 25000, label: "Premium", current: referralRate === 25000 },
              { rate: 30000, label: "Elite", current: referralRate === 30000 },
            ].map((tier) => (
              <div
                key={tier.rate}
                className={`p-4 border rounded-lg ${
                  tier.current ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{tier.label} - ₦{formatCurrency(tier.rate)}/referral</p>
                    <p className="text-sm text-muted-foreground">
                      {tier.current ? 'Current Rate' : `Upgrade for ₦${formatCurrency(tier.rate)}`}
                    </p>
                  </div>
                  {tier.current && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Contact support to upgrade your referral rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarnMore;
