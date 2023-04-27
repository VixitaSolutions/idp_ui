export type SearchInfo = {
    id: string;
    value: [{
      title: string;
      subtitle: string;
      authors: string[];
      publisher: string;
      publishDate: string;
      description: string;
      averageRating: number;
      ratingsCount: number;
      img: string;
      pagemap: {
        cse_thumbnail: any;
        smallThumbnail: string;
      };
      
    }];
  }
  