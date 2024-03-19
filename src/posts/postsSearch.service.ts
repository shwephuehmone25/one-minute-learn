import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostEntity } from './post.entity';
import PostSearchBody from '../types/postSearchBody.interface';

@Injectable()
export default class PostsSearchService {
  private readonly index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) { }

  async indexPost(post: PostEntity) {
    const fileUrl = post.file ? post.file.url : '';

    return this.elasticsearchService.index<PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.author.id,
        file: fileUrl,
      },
    });
  }

  async count(query: string, fields: string[]): Promise<number> {
    const response = await this.elasticsearchService.count({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });

    let count: number;
    if (typeof response.count === 'number') {
      count = response.count;
    } else {
      count = response.count as number;
    }

    return count;
  }

  async search(
    text: string,
    offset?: number,
    limit?: number,
    startId = 0,
  ): Promise<{ count: number; results: PostSearchBody[] }> {
    let separateCount = 0;

    if (startId) {
      separateCount = await this.count(text, ['title', 'content']);
    }

    const response = await this.elasticsearchService.search({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'content'],
              },
            },
            filter: {
              range: {
                id: {
                  gt: startId,
                },
              },
            },
          },
        },
        sort: {
          id: {
            order: 'asc',
          },
        },
      },
    });

    const results: PostSearchBody[] = response.hits.hits.map(hit => {
      const source = hit._source as PostSearchBody;
      return {
        id: source.id,
        title: source.title,
        content: source.content,
        userId: source.userId,
        file: source.file,
      };
    });

    const count = startId
      ? separateCount
      : typeof response.hits.total === 'object' ? response.hits.total.value : response.hits.total;

    return {
      count,
      results,
    };
  }

  async update(post: PostEntity): Promise<any> {
    const fileUrl = post.file ? post.file.url : '';

    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      userId: post.author.id,
      file: fileUrl,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    try {
      await this.elasticsearchService.updateByQuery({
        index: this.index,
        body: {
          query: {
            match: {
              id: post.id,
            },
          },
          script: {
            source: script,
          },
        },
      });
      return { success: true, message: 'Post updated successfully.' };
    } catch (error) {
      return {
        success: false,
        message: `Error updating post: ${error.message}`,
      };
    }
  }

  async remove(postId: number) {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }
}
