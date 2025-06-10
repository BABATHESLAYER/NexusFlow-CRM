import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, PlusCircleIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon, Edit2Icon, Trash2Icon } from 'lucide-react'; // Assuming lucide-react has these social icons or similar
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock social media posts data
const mockPosts = [
  { id: '1', platform: 'Twitter', content: 'Excited to announce our new feature! #NewRelease #Innovation', scheduledDate: '2023-10-20', status: 'Scheduled', image: 'https://placehold.co/100x100.png?text=Post1', dataAiHint: 'social media' },
  { id: '2', platform: 'Facebook', content: 'Check out our latest blog post on CRM best practices. Link in bio!', scheduledDate: '2023-10-22', status: 'Published', image: 'https://placehold.co/100x100.png?text=Post2', dataAiHint: 'blog announcement' },
  { id: '3', platform: 'Instagram', content: 'Behind the scenes at NexusFlow CRM! #TeamCulture #WorkLife', scheduledDate: '2023-10-25', status: 'Draft', image: 'https://placehold.co/100x100.png?text=Post3', dataAiHint: 'team photo' },
  { id: '4', platform: 'LinkedIn', content: 'We are hiring! Looking for passionate developers to join our team. #Hiring #TechJobs', scheduledDate: '2023-10-28', status: 'Scheduled', image: 'https://placehold.co/100x100.png?text=Post4', dataAiHint: 'hiring graphic' },
];

const platformIcons: { [key: string]: React.ElementType } = {
  Twitter: TwitterIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
};

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Scheduled': 'default',
  'Published': 'secondary',
  'Draft': 'outline',
  'Failed': 'destructive',
};

export default function SocialMediaPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageTitle title="Social Media Calendar" description="Plan and manage your social media posts." />
        <Button asChild>
          <Link href="/social-media/new">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Schedule Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPosts.map((post) => {
          const PlatformIcon = platformIcons[post.platform] || CalendarIcon;
          return (
            <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-lg flex items-center">
                      <PlatformIcon className="mr-2 h-5 w-5 text-primary" />
                      {post.platform} Post
                    </CardTitle>
                    <CardDescription>Scheduled for: {post.scheduledDate}</CardDescription>
                  </div>
                  <Badge variant={statusVariantMap[post.status] || 'default'}>{post.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={`Post for ${post.platform}`} 
                    className="rounded-md mb-2 w-full h-32 object-cover"
                    data-ai-hint={post.dataAiHint}
                  />
                )}
                <p className="text-sm line-clamp-3">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm"><Edit2Icon className="mr-1 h-3 w-3" /> Edit</Button>
                <Button variant="destructive" size="sm"><Trash2Icon className="mr-1 h-3 w-3" /> Delete</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {mockPosts.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-10 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No posts scheduled</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by scheduling your first social media post.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/social-media/new">
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Schedule Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
