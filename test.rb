class Post
  attr_accessor :title, :author, :content

  def initialize(title, author, content)
    @title = title
    @author = author
    @content = content
    @published_at = nil
  end

  def publish!
    @published_at = Time.now
    puts "Post '#{@title}' has been published."
  end

  def summary(length = 100)
    "#{content[0...length]}..."
  end

  private

  def word_count
    @content.split.size
  end
end

my_post = Post.new(
  "Ruby for Beginners",
  "John Doe",
  "This is a long article about the Ruby programming language."
)

my_post.publish!
puts "Summary: #{my_post.summary(20)}"
