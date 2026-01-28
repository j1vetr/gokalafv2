import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Mail, Users, Send, ArrowLeft, Search, Filter, CheckCircle, 
  XCircle, Clock, Loader2, AlertCircle, User, Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailUser {
  id: string;
  email: string;
  fullName: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  filter: string;
  status: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export default function AdminEmailMarketing() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showSingleEmailDialog, setShowSingleEmailDialog] = useState(false);
  const [selectedSingleUser, setSelectedSingleUser] = useState<EmailUser | null>(null);

  const [campaignName, setCampaignName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/email/users", filter],
    queryFn: async () => {
      const res = await fetch(`/api/admin/email/users?filter=${filter}`);
      if (!res.ok) throw new Error("Kullanıcılar yüklenemedi");
      return res.json();
    },
    enabled: isAdmin,
  });

  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ["/api/admin/email/campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/admin/email/campaigns");
      if (!res.ok) throw new Error("Kampanyalar yüklenemedi");
      return res.json();
    },
    enabled: isAdmin,
  });

  const sendBulkMutation = useMutation({
    mutationFn: async (data: { filter: string; subject: string; content: string; campaignName: string }) => {
      const res = await fetch("/api/admin/email/send-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gönderim başarısız");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Başarılı", description: data.message });
      setShowComposeDialog(false);
      setCampaignName("");
      setEmailSubject("");
      setEmailContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email/campaigns"] });
    },
    onError: (error: Error) => {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    },
  });

  const sendSingleMutation = useMutation({
    mutationFn: async (data: { email: string; subject: string; content: string }) => {
      const res = await fetch("/api/admin/email/send-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gönderim başarısız");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Email gönderildi" });
      setShowSingleEmailDialog(false);
      setSelectedSingleUser(null);
      setEmailSubject("");
      setEmailContent("");
    },
    onError: (error: Error) => {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Bu sayfaya erişim yetkiniz yok</p>
          <Button onClick={() => setLocation("/gokadmin")} className="bg-primary text-black">
            Admin Girişi
          </Button>
        </div>
      </div>
    );
  }

  const users: EmailUser[] = usersData?.users || [];
  const campaigns: Campaign[] = campaignsData?.campaigns || [];

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSendBulk = () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({ title: "Hata", description: "Konu ve içerik gerekli", variant: "destructive" });
      return;
    }
    sendBulkMutation.mutate({
      filter,
      subject: emailSubject,
      content: emailContent,
      campaignName: campaignName || `Kampanya - ${new Date().toLocaleDateString('tr-TR')}`,
    });
  };

  const handleSendSingle = () => {
    if (!selectedSingleUser || !emailSubject.trim() || !emailContent.trim()) {
      toast({ title: "Hata", description: "Tüm alanlar gerekli", variant: "destructive" });
      return;
    }
    sendSingleMutation.mutate({
      email: selectedSingleUser.email,
      subject: emailSubject,
      content: emailContent,
    });
  };

  const openSingleEmail = (user: EmailUser) => {
    setSelectedSingleUser(user);
    setEmailSubject("");
    setEmailContent("");
    setShowSingleEmailDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle size={12} className="mr-1" />Tamamlandı</Badge>;
      case "sending":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 size={12} className="mr-1 animate-spin" />Gönderiliyor</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle size={12} className="mr-1" />Başarısız</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><Clock size={12} className="mr-1" />Bekliyor</Badge>;
    }
  };

  const getFilterLabel = (f: string) => {
    switch (f) {
      case "has_package": return "Paket Alanlar";
      case "no_package": return "Paket Almayanlar";
      default: return "Tüm Kullanıcılar";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/gokadmin")}
              className="text-gray-400 hover:text-white"
              data-testid="button-back"
            >
              <ArrowLeft size={20} className="mr-2" /> Geri
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white uppercase">E-mail Pazarlama</h1>
              <p className="text-gray-500 text-sm">Kullanıcılara toplu veya tekli email gönderin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Package size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Filtrelenen</p>
                  <p className="text-2xl font-bold text-white">{filteredUsers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Mail size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Kampanyalar</p>
                  <p className="text-2xl font-bold text-white">{campaigns.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="İsim veya email ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/40 border-white/10"
                    data-testid="input-search"
                  />
                </div>
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-[200px] bg-black/40 border-white/10" data-testid="select-filter">
                  <Filter size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                  <SelectItem value="has_package">Paket Alanlar</SelectItem>
                  <SelectItem value="no_package">Paket Almayanlar</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setShowComposeDialog(true)}
                className="bg-primary text-black hover:bg-primary/90"
                disabled={filteredUsers.length === 0}
                data-testid="button-compose-bulk"
              >
                <Send size={16} className="mr-2" /> Toplu Email Gönder
              </Button>
            </div>

            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p>Kullanıcı bulunamadı</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={toggleSelectAll}
                          data-testid="checkbox-select-all"
                        />
                      </TableHead>
                      <TableHead className="text-gray-400">Kullanıcı</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400 text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(u.id)}
                            onCheckedChange={() => toggleSelectUser(u.id)}
                            data-testid={`checkbox-user-${u.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <User size={14} className="text-primary" />
                            </div>
                            <span className="text-white font-medium">{u.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">{u.email}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openSingleEmail(u)}
                            className="text-gray-400 hover:text-primary"
                            data-testid={`button-send-single-${u.id}`}
                          >
                            <Mail size={14} className="mr-1" /> Gönder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Kampanya Geçmişi</h2>
            
            {campaignsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail size={40} className="mx-auto mb-3 opacity-50" />
                <p>Henüz kampanya yok</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-400">Kampanya</TableHead>
                      <TableHead className="text-gray-400">Filtre</TableHead>
                      <TableHead className="text-gray-400">Durum</TableHead>
                      <TableHead className="text-gray-400">İlerleme</TableHead>
                      <TableHead className="text-gray-400">Tarih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c) => (
                      <TableRow key={c.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{c.name}</p>
                            <p className="text-gray-500 text-xs">{c.subject}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/20 text-gray-400">
                            {getFilterLabel(c.filter)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(c.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${c.totalRecipients > 0 ? (c.sentCount / c.totalRecipients) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-gray-400 text-xs">{c.sentCount}/{c.totalRecipients}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Toplu Email Gönder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
              <p className="text-primary font-medium">
                {getFilterLabel(filter)} - {filteredUsers.length} kişiye gönderilecek
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Emailler 10 saniye arayla tek tek gönderilecek
              </p>
            </div>
            
            <div>
              <Label className="text-gray-400">Kampanya Adı (opsiyonel)</Label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Örn: Yeni Yıl Kampanyası"
                className="bg-black/40 border-white/10 mt-1"
                data-testid="input-campaign-name"
              />
            </div>
            
            <div>
              <Label className="text-gray-400">Konu *</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email konusu"
                className="bg-black/40 border-white/10 mt-1"
                data-testid="input-subject"
              />
            </div>
            
            <div>
              <Label className="text-gray-400">İçerik * (HTML desteklenir)</Label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Email içeriği... {{fullName}} ile kişinin adını ekleyebilirsiniz"
                className="bg-black/40 border-white/10 mt-1 min-h-[200px] font-mono text-sm"
                data-testid="textarea-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowComposeDialog(false)}>İptal</Button>
            <Button
              onClick={handleSendBulk}
              disabled={sendBulkMutation.isPending || !emailSubject.trim() || !emailContent.trim()}
              className="bg-primary text-black hover:bg-primary/90"
              data-testid="button-send-bulk"
            >
              {sendBulkMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
              Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSingleEmailDialog} onOpenChange={setShowSingleEmailDialog}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Email Gönder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedSingleUser && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedSingleUser.fullName}</p>
                  <p className="text-gray-400 text-sm">{selectedSingleUser.email}</p>
                </div>
              </div>
            )}
            
            <div>
              <Label className="text-gray-400">Konu *</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email konusu"
                className="bg-black/40 border-white/10 mt-1"
                data-testid="input-single-subject"
              />
            </div>
            
            <div>
              <Label className="text-gray-400">İçerik * (HTML desteklenir)</Label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Email içeriği..."
                className="bg-black/40 border-white/10 mt-1 min-h-[200px] font-mono text-sm"
                data-testid="textarea-single-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSingleEmailDialog(false)}>İptal</Button>
            <Button
              onClick={handleSendSingle}
              disabled={sendSingleMutation.isPending || !emailSubject.trim() || !emailContent.trim()}
              className="bg-primary text-black hover:bg-primary/90"
              data-testid="button-send-single-confirm"
            >
              {sendSingleMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
              Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
